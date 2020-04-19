// Constants
const sugarizerUrl = "https://try.sugarizer.org/";

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
					video: "videos/"+directory.toLowerCase()+".gif"
				});
			}
			return activities;
		}
	}
});
