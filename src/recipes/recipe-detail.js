import { bindable, inject } from 'aurelia-framework';
import $ from 'jquery';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { SpoonacularApi } from '../shared/spoonacular-api';
import { AppState } from '../shared/app-state';

@inject(SpoonacularApi, EventAggregator, Router, AppState)
export class RecipeDetail {
	constructor(SpoonacularApi, EventAggregator, Router, AppState) {
		this.api = SpoonacularApi;
		this.ea = EventAggregator;
		this.router = Router;
		this.as = AppState;
	}

	activate(params, routeConfig) {
		this.as.recipes = this.as.recipes || {};
		if (!this.as.recipes[params.id]) {
			this.api.getRecipeInformation(params.id, true)
				.then(res => {
					this.recipe = res;
					this.as.recipes[params.id] = res;
				});
		} else {
			this.recipe = this.as.recipes[params.id];
		}
	}

	back() {
		if (!this.router.previousLocation || this.router.previousLocation === this.router.currentInstruction.fragment) {
			this.router.navigateToRoute('search');
		} else {
			this.router.navigateBack();
		}
	}
}
