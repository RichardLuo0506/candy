import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

@inject(HttpClient)
export class SpoonacularApi {
	constructor(HttpClient) {
		this.httpClient = HttpClient;
		this.httpClient.configure(config => {
			config
				.useStandardConfiguration()
				.withBaseUrl('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/')
				.withDefaults({
					credentials: 'same-origin',
					headers: {
						'X-Mashape-Key': 'rpFyX1EbOJmsh06LKs9gjfJAKemgp13isabjsnFh5UrUSM2KMd',
						'Accept': 'application/json'
					}
				});
		});
		this.session = localStorage.authToken || null;
	}

	autocompleteRecipeSearch(query, number) {
		let appendage = `?query=${query}&number=${number || 3}`;
		// let appendage = "?number=2&query=chicken";
		return this.httpClient.fetch('recipes/autocomplete' + appendage, {
			method: 'get'
		}).then(res => res.json());
	}

	getRecipeInformation(id, includeNutrition) {
		return this.httpClient.fetch('recipes/' + id + `/information?includeNutrition=${includeNutrition}`, {
			method: 'get'
		}).then(res => res.json());
	}

	searchRecipes(query, cuisine, diet, excludeIngredients, intolerances, limitLicense, number, offset, type) {
		console.log('Search Args', arguments);
		let appendage = `?query=${query}&number=${number || 20}`;
		if (cuisine) {
			appendage += `&cuisine=${cuisine}`;
		}
		if (diet) {
			appendage += `&cuisine=${diet}`;
		}
		if (excludeIngredients) {
			appendage += `&cuisine=${excludeIngredients}`;
		}
		if (intolerances) {
			appendage += `&intolerances=${intolerances}`;
		}
		if (limitLicense) {
			appendage += `&cuisine=${limitLicense}`;
		}
		if (offset) {
			appendage += `&cuisine=${offset}`;
		}
		if (type) {
			appendage += `&cuisine=${type}`;
		}

		return this.httpClient.fetch('recipes/search' + appendage, {
			method: 'get'
		}).then(res => res.json());
	}
}
