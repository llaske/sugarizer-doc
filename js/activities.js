// Constants
const sugarizerUrl = "https://try.sugarizer.org/";
const tagsProperties = {
	"all": "#fffff",
	"math": "#febcc8",
	"reading": "#ffffd8",
	"writing": "#eaebff",
	"create": "#e0fefe",
	"explore": "#CEC8E4",
	"simulate": "#d3eeff",
	"programming": "#D9FFDF",
	"games": "#FDCFB3",
	"collaborate": "#F9F7E8",
	"tools": "#d0d0d0"
};
const activitiesTags = {
	"org.sugarlabs.Falabracman": ["games"],
	"org.sugarlabs.Exerciser": ["tools","collaborate"],
	"org.sugarlabs.GearsActivity": ["simulate"],
	"org.sugarlabs.MazeWebActivity": ["games","collaborate"],
	"org.olpcfrance.PaintActivity": ["create","collaborate"],
	"org.olpcfrance.TamTamMicro": ["create"],
	"org.olpcfrance.MemorizeActivity": ["games","collaborate"],
	"org.olpg-france.physicsjs": ["simulate"],
	"org.sugarlabs.CalculateActivity": ["math"],
	"org.sugarlabs.TurtleBlocksJS": ["programming"],
	"org.sugarlabs.Clock": ["explore"],
	"org.sugarlabs.SpeakActivity": ["reading"],
	"org.sugarlabs.moon": ["explore"],
	"org.olpcfrance.RecordActivity": ["create"],
	"org.olpcfrance.Abecedarium": ["reading","explore"],
	"org.olpcfrance.videoviewer": ["explore"],
	"org.olpcfrance.FoodChain": ["games"],
	"org.olpc-france.labyrinthjs": ["writing","collaborate"],
	"org.olpcfrance.TankOp": ["math","games"],
	"org.sugarlabs.ChatPrototype": ["tools","collaborate"],
	"org.olpcfrance.Gridpaint": ["create"],
	"org.olpc-france.LOLActivity": ["games", "collaborate"],
	"org.olpcfrance.sharednotes": ["writing","collaborate"],
	"org.sugarlabs.ColorMyWorldActivity": ["explore"],
	"com.homegrownapps.xoeditor": ["tools"],
	"com.homegrownapps.reflection": ["math","games"],
	"com.homegrownapps.abacus": ["math"],
	"org.sugarlabs.SprintMath": ["math","games"],
	"org.sugarlabs.Blockrain": ["games"],
	"org.sugarlabs.StopwatchActivity": ["tools"],
	"com.homegrownapps.flip": ["games"],
	"org.somosazucar.JappyActivity": ["programming"],
	"org.olpcfrance.qrcode": ["tools"],
	"org.sugarlabs.Markdown": ["writing"],
	"org.sugarlabs.Scratch": ["programming"],
	"org.sugarlabs.gameOfLife": ["simulate"],
	"org.sugarlabs.FotoToonJs": ["create"],
	"org.sugarlabs.GTDActivity": ["tools"],
	"org.squeak.EtoysActivity": ["programming"],
	"org.olpcfrance.EbookReader": ["reading", "explore"],
	"org.olpcfrance.Calligra": ["writing"],
	"org.olpcfrance.MediaViewerActivity": ["tools"],
	"org.sugarlabs.PomodoroActivity": ["tools"],
	"org.sugarlabs.Constellation": ["explore"],
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
	vuetify: new Vuetify(),
	template: `
		<v-app>
			<v-content>
				<a href="index.html#gallery" data-l10n-id="menu-home" title="Home" class="btn btn-lg btn-red btn-back">ACCUEIL</a>
				<div class="filter-list">
					<div v-for="(val, tag) in tags" class="filter-button">
						<input id="filter" v-bind:value="tag" type="radio" v-on:click="onFilter(tag)" :checked="(tag==filter||(tag=='all'&&filter==''))"/>
						<div class="tag-button" v-bind:style="'background-color:'+val+(tag==filter||(tag=='all'&&filter=='')?';font-weight:bold':'')">{{computeTagText(tag)}}</div>
					</div>
				</div>
				<v-data-table :headers="headers" :items="filteredActivities()" :items-per-page="100" class="elevation-1"
				:footer-props="{showFirstLastPage:false, disablePagination:true, disableItemsPerPage:true, showCurrentPage:false, showFirstLastPage:false}">
					<template v-slot:item.icon="{item}">
						<v-img v-bind:src="item.icon" height="50px" width="50px"></v-img>
					</template>
					<template v-slot:item.name="{item}">
						<strong>{{item.name}}</strong>
					</template>
					<template v-slot:item.tags="{item}">
						<div v-for="tag in item.tags">
							<div class='tag-style' v-bind:style="'background-color:'+computeTagColor(tag)">{{computeTagText(tag)}}</div>
						</div>
					</template>
					<template v-slot:item.video="{item}">
						<a class="btn btn-red" data-featherlight="image" v-bind:href="item.video">{{getDemoText()}}</a>
					</template>
				</v-data-table>
			</v-content>
		</v-app>`,
	data: {
		message: "",
		headers: [
			{text: "", value: "icon", sortable: false},
			{text: "", value: "name", width: 140},
			{text: "", value: "description", sortable: false},
			{text: "", value: "tags", sortable: false},
			{text: "", value: "video", sortable: false}
		],
		activities: [],
		filter: "",
		tags: tagsProperties
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
					tags: activitiesTags[activity.id]
				});
			}
			activities.sort(function(a,b) {
				return (a.name == b.name ? 0 : a.name > b.name ? 1 : -1);
			});
			return activities;
		},

		//
		filteredActivities: function() {
			var vm = this;
			return vm.activities.filter(function(item) {
				return vm.filter.length == 0 || item.tags.indexOf(vm.filter) != -1;
			});
		},

		// Compute column styles
		computeTagColor: function(tag) {
			return tagsProperties[tag];
		},
		computeTagText: function(tag) {
			return document.webL10n.get("category-"+tag);
		},
		getDemoText: function() {
			return document.webL10n.get("button-demo");
		},

		// Filter
		onFilter: function(tag) {
			var vm = this;
			if (tag == "all") {
				vm.filter = "";
			} else {
				vm.filter = tag;
			}
		}
	}
});
