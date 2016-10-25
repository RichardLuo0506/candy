import { bindable, inject } from 'aurelia-framework';
import $ from 'jquery';
import { SpoonacularApi } from './spoonacular-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ResultsFound, FiltersUpdated } from './events-hub';

@inject(SpoonacularApi, Element, EventAggregator)
export class FgSuggestSearch {
	@bindable searchFocus;
	@bindable searchTerm;

	constructor(SpoonacularApi, Element, EventAggregator) {
		this.api = SpoonacularApi;
		this.elem = Element;
		this.ea = EventAggregator;
		this.placeholder = 'search recipes';

		this.ea.subscribe(FiltersUpdated, data => this.filters = data.filters);
		this.filters = {};
	}

	inputHandler(e) {
		let key = e.keyCode;
		let disallowedKeys = [13, 27, 37, 38, 39, 40];
		// 13 enter
		// 27 esc
		if (disallowedKeys.indexOf(key) > -1) {
			if (key === 38) {
				this.selectPrevSuggestion();
			} else if (key === 40) {
				this.selectNextSuggestion();
			} else if (key === 13) {
				if (this.displaySuggestions && this.selectedSuggestion > -1) {
					this.searchTerm = this.suggestions[this.selectedSuggestion].title;
				}

				//account for debounce
				let me = this;
				setTimeout(function() {
					me.searchRecipes();
				}, 150);
			}
		} else {
			return true;
		}
	}

	searchRecipes() {
		this.api.searchRecipes(this.searchTerm, this.filters.cuisineString, this.filters.dietString, this.filters.excludeIngredientsString, this.filters.intolerancesString, this.filters.limitLicenseString, this.filters.numberString, this.filters.offsetString, this.filters.typeString)
			.then(res => {
				console.log('recipes found', res);
				this.ea.publish(new ResultsFound(res));
				this.displaySuggestions = false;
			});
	}

	searchFocusChanged(newValue, oldValue) {
		if (!newValue) {
			this.displaySuggestions = false;
		}
	}

	searchTermChanged(newValue, oldValue) {
		this.selectedSuggestion = -1;
		this.api.autocompleteRecipeSearch(newValue)
			.then(suggestions => {
				if (suggestions.length) {
					this.suggestions = suggestions;
					this.displaySuggestions = true;
				} else {
					this.displaySuggestions = false;
				}
			});
	}

	selectPrevSuggestion() {
		if (this.suggestions && this.suggestions.length) {
			this.selectedSuggestion - 1 > -1 ? this.selectedSuggestion-- : this.selectedSuggestion = this.suggestions.length - 1;
		}
	}

	selectNextSuggestion() {
		if (this.suggestions && this.suggestions.length) {
			this.selectedSuggestion + 1 < this.suggestions.length ? this.selectedSuggestion++ : this.selectedSuggestion = 0;
		}
	}
}
