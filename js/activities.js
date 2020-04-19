// Constants
const sugarizerUrl = "https://try.sugarizer.org/";
const tags = [
	"math",
	"reading",
	"writing",
	"create",
	"simulate",
	"programming",
	"games",
	"content",
	"collaborate"
];
const activitiesTags = {
	"org.sugarlabs.Falabracman": ["games"],
	"org.sugarlabs.Exerciser": ["collaborate"],
	"org.sugarlabs.GearsActivity": ["simulate"],
	"org.sugarlabs.MazeWebActivity": ["games","collaborate"],
	"org.olpcfrance.PaintActivity": ["create","collaborate"],
	"org.olpcfrance.TamTamMicro": ["create"],
	"org.olpcfrance.MemorizeActivity": ["games","collaborate"],
	"org.olpg-france.physicsjs": ["simulate"],
	"org.sugarlabs.CalculateActivity": ["math"],
	"org.sugarlabs.TurtleBlocksJS": ["programming"],
	"org.sugarlabs.Clock": [],
	"org.sugarlabs.SpeakActivity": ["reading"],
	"org.sugarlabs.moon": ["simulate"],
	"org.olpcfrance.RecordActivity": ["create"],
	"org.olpcfrance.Abecedarium": ["reading","content"],
	"org.olpcfrance.videoviewer": ["content"],
	"org.olpcfrance.FoodChain": ["games"],
	"org.olpc-france.labyrinthjs": ["create","collaborate"],
	"org.olpcfrance.TankOp": ["math","games"],
	"org.sugarlabs.ChatPrototype": ["collaborate"],
	"org.olpcfrance.Gridpaint": ["create"],
	"org.olpc-france.LOLActivity": ["games"],
	"org.olpcfrance.sharednotes": ["create","writing","collaborate"],
	"org.sugarlabs.ColorMyWorldActivity": ["simulate"],
	"com.homegrownapps.xoeditor": [],
	"com.homegrownapps.reflection": ["math","games"],
	"com.homegrownapps.abacus": ["math"],
	"org.sugarlabs.SprintMath": ["math","games"],
	"org.sugarlabs.Blockrain": ["games"],
	"org.sugarlabs.StopwatchActivity": [],
	"com.homegrownapps.flip": ["games"],
	"org.somosazucar.JappyActivity": ["programming"],
	"org.olpcfrance.qrcode": [],
	"org.sugarlabs.Markdown": ["writing"],
	"org.sugarlabs.Scratch": ["programming"],
	"org.sugarlabs.gameOfLife": ["simulate"],
	"org.sugarlabs.FotoToonJs": ["create"],
	"org.sugarlabs.GTDActivity": [],
	"org.squeak.EtoysActivity": ["programming"],
	"org.olpcfrance.EbookReader": ["reading"],
	"org.olpcfrance.Calligra": ["writing"],
	"org.olpcfrance.MediaViewerActivity": ["content"],
	"org.sugarlabs.PomodoroActivity": [],
	"org.sugarlabs.Constellation": ["simulate"],
	"org.sugarlabs.Write": ["writing","collaborate"]
};

// Rebase require directory
requirejs.config({
	baseUrl: "js",
	paths: {
		activity: "../js"
	}
});

// Vue main app
var app = new Vue({
	el: '#app',
	template: `<p>{{message}}</p>`,
	components: {
	},
	data: {
		message: ""
	},

	created: function() {
		var vm = this;
		requirejs(["l10n"], function (webL10n) {
			window.addEventListener("localized", function() {
				if (document.webL10n.get("TutoActivityAbecedariumactivity")=="{{TutoActivityAbecedariumactivity}}") {
					return;
				}
				vm.loadActivities();
			});
		});
	},

	mounted: function() {
	},

	methods: {
		// Load activities list from web site
		loadActivities: function() {
			var vm = this;
			var url = sugarizerUrl + "activities.json";
			axios.get(url)
				.then(function(response) {
					vm.activities = vm.parseActivities(response.data);
					vm.message = vm.activities;
				})
				.catch(function(error) {
					console.log(error)
				});
		},

		// Parse activities.json file to create an array of Activities
		parseActivities: function(data) {
			let activities = [];
			for (let i = 0 ; i < data.length ; i++) {
				let activity = data[i];
				let directory = activity.directory.replace(".activity","").replace("activities/","");
				activities.push({
					id: activity.id,
					name: activity.name,
					icon: sugarizerUrl+activity.directory+"/"+activity.icon,
					description: document.webL10n.get("TutoActivity"+directory+"activity"),
					video: "videos/"+directory.toLowerCase()+".gif",
					tags: activitiesTags[activity.id].map(function(tag) {
						return document.webL10n.get("category-"+tag);
					})
				});
			}
			return activities;
		}
	}
});
