import { bindable, inject } from 'aurelia-framework';
import $ from 'jquery';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ResultsFound, FiltersUpdated } from '../shared/events-hub';
import { Router } from 'aurelia-router';
import { AppState } from '../shared/app-state';

@inject(EventAggregator, Router, AppState)
export class Search {
	constructor(ea, Router, AppState) {
		this.ea = ea;
		this.router = Router;
		this.ea.subscribe(ResultsFound, res => this.showResults(res));
		this.filters = this.filters || {};
		this.countries = this.countries || this.getCountries();
		this.intolerances = this.intolerances || this.getIntolerances();
		this.as = AppState;
		console.log('', 'construct');
	}

	activate(params, routeConfig, navigationInstruction) {
		console.log('', 'activate');
		console.log('search stuff', this.as.search);
		let keys = Object.keys(this.as.search);
		for (let i = 0, len = keys.length; i < len; i++) {
			let key = keys[i];
			this[key] = this.as.search[key];
		}
	}

	deactivate() {
		console.log('', this.filters);
		this.as.search = this.as.search || {};
		this.as.search.filters = this.filters;
		this.as.search.baseUri = this.baseUri;
		this.as.search.results = this.results;
		this.as.search.countries = this.countries;
		this.as.search.intolerances = this.intolerances;
	}

	showResults(res) {
		this.baseUri = res.data.baseUri;
		this.results = res.data.results;
	}

	countriesChanged() {
		console.log('', this.countries);
	}

	getCountries() {
		return [
			{ name: 'chinese', thumbnail: 'src/assets/img/flags/china.png' },
			{ name: 'french', thumbnail: 'src/assets/img/flags/france.png' },
			{ name: 'greek', thumbnail: 'src/assets/img/flags/greece.png' },
			{ name: 'indian', thumbnail: 'src/assets/img/flags/india.png' },
			{ name: 'italian', thumbnail: 'src/assets/img/flags/italy.png' },
			{ name: 'japanese', thumbnail: 'src/assets/img/flags/japan.png' },
			{ name: 'korean', thumbnail: 'src/assets/img/flags/korea.png' },
			{ name: 'mexican', thumbnail: 'src/assets/img/flags/mexico.png' },
			{ name: 'thai', thumbnail: 'src/assets/img/flags/thailand.png' }
		];
	}

	getIntolerances() {
		return [
			{ name: 'dairy', thumbnail: 'src/assets/img/allergens/dairy-free.png' },
			{ name: 'egg', thumbnail: 'src/assets/img/allergens/egg-free.png' },
			{ name: 'gluten', thumbnail: 'src/assets/img/allergens/gluten-free.png' },
			{ name: 'peanut', thumbnail: 'src/assets/img/allergens/peanut-free.png' },
			// { name: 'sesame', thumbnail: 'src/assets/img/allergens/china.png' },
			// { name: 'seafood', thumbnail: 'src/assets/img/allergens/china.png' },
			{ name: 'shellfish', thumbnail: 'src/assets/img/allergens/crustean-free.png' },
			{ name: 'soy', thumbnail: 'src/assets/img/allergens/soya-free.png' },
			// { name: 'sulfite', thumbnail: 'src/assets/img/allergens/china.png' },
			{ name: 'tree nut', thumbnail: 'src/assets/img/allergens/nut-free.png' },
			// { name: 'wheat', thumbnail: 'src/assets/img/allergens/china.png' },
		];
	}

	parseFilter(type, array) {
		let me = this;
		let filterArray = [];
		let filterString = '';
		for (let i = 0, len = array.length; i < len; i++) {
			let item = array[i];
			if (item.active) {
				filterArray.push(item);
				if (filterArray.length > 1) {
					filterString += ', ';
				}
				filterString += item.name;
			}
		}
		this.filters[type] = filterArray;
		console.log('parsed filter', filterArray);
		this.filters[type + 'String'] = filterString;
	}

	toggleCountry(country) {
		country.active = !country.active;
		this.parseFilter('cuisine', this.countries);
		this.ea.publish(new FiltersUpdated(this.filters));
	}

	toggleIntolerance(allergen) {
		allergen.active = !allergen.active;
		this.parseFilter('intolerances', this.intolerances);
		this.ea.publish(new FiltersUpdated(this.filters));
	}

	viewRecipe(recipe) {
		console.log('', recipe);
		this.router.navigateToRoute('recipe', { id: recipe.id });
	}
}
