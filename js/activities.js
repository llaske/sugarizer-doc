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
const agesProperties = [4, 6, 8, 11];
const activitiesInfo = {
	"org.sugarlabs.Falabracman": {tags: ["games","reading"], age: 4},
	"org.sugarlabs.Exerciser": {tags: ["tools","collaborate"], age: 8},
	"org.sugarlabs.GearsActivity": {tags: ["simulate"], age: 4},
	"org.sugarlabs.MazeWebActivity": {tags: ["games","collaborate"], age: 6},
	"org.olpcfrance.PaintActivity": {tags: ["create","collaborate"], age: 4},
	"org.olpcfrance.TamTamMicro": {tags: ["create"], age: 4},
	"org.olpcfrance.MemorizeActivity": {tags: ["games","collaborate"], age: 4},
	"org.olpg-france.physicsjs": {tags: ["simulate"], age: 11},
	"org.sugarlabs.CalculateActivity": {tags: ["math"], age: 6},
	"org.sugarlabs.TurtleBlocksJS": {tags: ["programming"], age: 6},
	"org.sugarlabs.Clock": {tags: ["explore"], age: 6},
	"org.sugarlabs.SpeakActivity": {tags: ["reading"], age: 4},
	"org.sugarlabs.moon": {tags: ["explore"], age: 6},
	"org.olpcfrance.RecordActivity": {tags: ["create"], age: 8},
	"org.olpcfrance.Abecedarium": {tags: ["reading","explore"], age: 4},
	"org.olpcfrance.videoviewer": {tags: ["explore"], age: 8},
	"org.olpcfrance.FoodChain": {tags: ["games","explore"], age: 4},
	"org.olpc-france.labyrinthjs": {tags: ["writing","collaborate"], age: 11},
	"org.olpcfrance.TankOp": {tags: ["math","games"], age: 6},
	"org.sugarlabs.ChatPrototype": {tags: ["tools","collaborate"], age: 8},
	"org.olpcfrance.Gridpaint": {tags: ["create"], age: 4},
	"org.olpc-france.LOLActivity": {tags: ["games", "collaborate"], age: 6},
	"org.olpcfrance.sharednotes": {tags: ["writing","collaborate"], age: 8},
	"org.sugarlabs.ColorMyWorldActivity": {tags: ["explore"], age: 4},
	"com.homegrownapps.xoeditor": {tags: ["tools"], age: 4},
	"com.homegrownapps.reflection": {tags: ["math","games"], age: 4},
	"com.homegrownapps.abacus": {tags: ["math"], age: 4},
	"org.sugarlabs.SprintMath": {tags: ["math","games","collaborate"], age: 6},
	"org.sugarlabs.Blockrain": {tags: ["games"], age: 6},
	"org.sugarlabs.StopwatchActivity": {tags: ["tools"], age: 8},
	"com.homegrownapps.flip": {tags: ["games"], age: 4},
	"org.somosazucar.JappyActivity": {tags: ["programming"], age: 11},
	"org.olpcfrance.qrcode": {tags: ["tools"], age: 6},
	"org.sugarlabs.Markdown": {tags: ["writing"], age: 11},
	"org.sugarlabs.Scratch": {tags: ["programming"], age: 8},
	"org.sugarlabs.gameOfLife": {tags: ["simulate"], age: 11},
	"org.sugarlabs.FotoToonJs": {tags: ["create"], age: 6},
	"org.sugarlabs.GTDActivity": {tags: ["tools"], age: 11},
	"org.squeak.EtoysActivity": {tags: ["programming"], age: 8},
	"org.olpcfrance.EbookReader": {tags: ["reading", "explore"], age: 8},
	"org.olpcfrance.Calligra": {tags: ["writing"], age: 4},
	"org.olpcfrance.MediaViewerActivity": {tags: ["tools"], age: 6},
	"org.sugarlabs.PomodoroActivity": {tags: ["tools"], age: 11},
	"org.sugarlabs.Constellation": {tags: ["explore"], age: 6},
	"org.sugarlabs.Write": {tags: ["writing","collaborate"], age: 4}
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
				<a href="index.html#gallery" data-l10n-id="menu-home" title="Home" class="btn btn-lg btn-red btn-back">Home</a>
				<div v-if="activities.length>0" class="filtertag-list">
					<div v-for="(val, tag) in tags" class="filter-button">
						<input id="filter" v-bind:value="tag" type="radio" v-on:click="onFilterTag(tag)" :checked="(tag==filterTag||(tag=='all'&&filterTag==''))"/>
						<div class="tag-button" v-bind:style="'background-color:'+val+(tag==filterTag||(tag=='all'&&filterTag=='')?';font-weight:bold':'')">{{computeTagText(tag)}}</div>
					</div>
				</div>
				<div v-if="activities.length>0" class="filterage-list">
					<div v-for="(val, age) in ages" class="filter-button">
					<input class="input-button" id="filter" v-bind:value="val" type="radio" v-on:click="onFilterAge(val)" :checked="(val==filterAge)"/>
						<v-img class="age-button" v-bind:src="'./img/'+val+'year.svg'" height="50px" width="50px"></v-img>
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
					<template v-slot:item.age="{item}">
						<v-img v-bind:src="'./img/'+item.age+'year.svg'" height="50px" width="50px"></v-img>
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
			{text: "", value: "age", sortable: false},
			{text: "", value: "video", sortable: false}
		],
		activities: [],
		filterTag: "",
		filterAge: 11,
		filterName: "",
		tags: tagsProperties,
		ages: agesProperties
	},

	created: function() {
		var vm = this;
		requirejs(["l10n"], function (webL10n) {
			window.addEventListener("localized", function() {
				// Wait for Sugarizer locale.ini loading
				if (document.webL10n.get("TutoActivityAbecedariumactivity")=="{{TutoActivityAbecedariumactivity}}") {
					return;
				}

				// Load activities details
				vm.loadActivities();

				// Filter on hash
				let hash = window.location.hash.substr(1);
				if (hash.length && tagsProperties[hash]) {
					vm.filterTag = hash;
				}

				// Filter on activity name
				let params = new URL(window.location).searchParams;
				let name = params.get("name");
				if (name) {
					vm.filterName = name;
				}
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
					tags: activitiesInfo[activity.id].tags,
					age: activitiesInfo[activity.id].age
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
				return (vm.filterTag.length == 0 || item.tags.indexOf(vm.filterTag) != -1) &&
					(vm.filterName.length == 0 || item.name.indexOf(vm.filterName) != -1) &&
					(item.age <= vm.filterAge);
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
		onFilterTag: function(tag) {
			var vm = this;
			if (tag == "all") {
				vm.filterTag = "";
			} else {
				vm.filterTag = tag;
			}
		},
		onFilterAge: function(age) {
			var vm = this;
			vm.filterAge = age;
		}
	}
});
