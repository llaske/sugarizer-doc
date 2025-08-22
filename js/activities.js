// Constants
const sugarizerUrl = "https://dev.sugarizer.org/";
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
	"org.sugarlabs.Chat": {tags: ["tools","collaborate"], age: 8},
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
	"org.sugarlabs.Write": {tags: ["writing","collaborate"], age: 4},
	"org.sugarlabs.Tangram": {tags: ["games","create","collaborate"], age: 4},
	"org.sugarlabs.Vote": {tags: ["tools","collaborate"], age: 8},
	"org.sugarlabs.MindMath": {tags: ["math","games","collaborate"], age: 8},
	"org.sugarlabs.Curriculum": {tags: ["tools","collaborate"], age: 6},
	"org.sugarlabs.ChessActivity": {tags: ["games","collaborate"], age: 8},
	"org.sugarlabs.FractionBounce": {tags: ["math","games"], age: 8},
	"org.sugarlabs.Planets": {tags: ["explore"], age: 4},
	"org.sugarlabs.Implode": {tags: ["games"], age: 4},
	"org.olpcfrance.DollarStreet": {tags: ["explore"], age: 6},
	"org.olpcfrance.XmasLights": {tags: ["create","collaborate"], age: 6},
	"org.sugarlabs.Measure": {tags: ["explore","collaborate"], age: 6},
	"org.sugarlabs.Story": {tags: ["writing","collaborate"], age: 8},
	"org.sugarlabs.ChartActivity": {tags: ["math","collaborate"], age: 11},
	"org.sugarlabs.3DVolume": {tags: ["math","simulate","collaborate"], age: 8},
	"org.sugarlabs.HumanBody": {tags: ["explore","collaborate"], age: 8},
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
			<v-main>
				<a href="index.html#gallery" data-i18n="menu-home" title="Home" class="btn btn-lg btn-red btn-back">Home</a>
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
				<v-btn @click="toggleSort" style="justify-left:center; margin :0.5rem 0 0.5rem 22px; min-width: 0">
					<v-icon>{{ sortAsc ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
				</v-btn>
				<v-data-table :headers="headers" :items="filteredActivities()" :items-per-page="100" class="elevation-1"
				:footer-props="{showFirstLastPage:false, disablePagination:true, disableItemsPerPage:true, showCurrentPage:false, showFirstLastPage:false}"
				:disable-sort="true">
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
					<template v-slot:item.tryurl="{item}">
						<a class="btn btn-red" v-bind:href="item.tryurl" target="_new">{{getTryText()}}</a>
					</template>
				</v-data-table>
			</v-main>
		</v-app>`,
	data: {
		message: "",
		headers: [
			{text: "", value: "icon", sortable: false},
			{text: "", value: "name", width: 140},
			{text: "", value: "description", sortable: false},
			{text: "", value: "tags", sortable: false},
			{text: "", value: "age", sortable: false},
			{text: "", value: "video", sortable: false},
			{text: "", value: "tryurl", sortable: false}
		],
		activities: [],
		filterTag: "",
		filterAge: 11,
		filterName: "",
		sortBy: 'name',
		sortAsc: true,
		sortDesc: false,
		tags: tagsProperties,
		ages: agesProperties
	},

	created: function() {
		var vm = this;
		requirejs(["l10n"], function (l10n) {
			vm.l10n = l10n;
			let defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
			vm.l10n.init(defaultLanguage.split('-')[0]);
			window.addEventListener("localized", function() {
				vm.l10n.loadExternalResource("activities", sugarizerUrl+"locales").then(function() {
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

					// Set button
					vm.l10n.updateDocument()
				});
			});
		});
	},

	mounted: function() {
	},

	methods: {
		toggleSort() {
			this.sortAsc = !this.sortAsc;
			this.changeSort('name');
		  },
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
			var vm = this;
			for (let i = 0 ; i < data.length ; i++) {
				let activity = data[i];
				if (!activity.id || !activitiesInfo[activity.id]) {
					continue;
				}
				let directory = activity.directory.replace(".activity","").replace("activities/","");
				activities.push({
					id: activity.id,
					name: activity.name,
					icon: sugarizerUrl+activity.directory+"/"+activity.icon,
					description: vm.l10n.get("TutoActivity"+directory+"activity", {}, "activities"),
					video: "videos/"+directory.toLowerCase()+".gif",
					tryurl: sugarizerUrl+activity.directory+"/index.html?a="+activity.id+"&n="+activity.name+"&sa=1",
					tags: activitiesInfo[activity.id].tags,
					age: activitiesInfo[activity.id].age
				});
			}
			activities.sort(function(a,b) {
				return (a.name == b.name ? 0 : a.name > b.name ? 1 : -1);
			});
			return activities;
		},
		changeSort(sortBy) {
			if (this.sortBy === sortBy) {
			  this.sortDesc = !this.sortDesc;
			} else {
			  this.sortBy = sortBy;
			  this.sortDesc = false;
			}
		},
		

		//
		filteredActivities: function() {
			var vm = this;
			return vm.activities.filter(function(item) {
				return (vm.filterTag.length == 0 || item.tags.indexOf(vm.filterTag) != -1) &&
					(vm.filterName.length == 0 || item.name.indexOf(vm.filterName) != -1) &&
					(item.age <= vm.filterAge);
			})
			.sort(function(a, b) {
				const nameA = a[vm.sortBy].toLowerCase();
				const nameB = b[vm.sortBy].toLowerCase();
				return vm.sortDesc ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
			});
		},

		// Compute column styles
		computeTagColor: function(tag) {
			return tagsProperties[tag];
		},
		computeTagText: function(tag) {
			var vm = this;
			return vm.l10n.get("category-"+tag);
		},
		getDemoText: function() {
			var vm = this;
			return vm.l10n.get("button-demo");
		},
		getTryText: function() {
			var vm = this;
			return vm.l10n.get("button-try");
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