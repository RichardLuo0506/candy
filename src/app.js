export class App {
	configureRouter(config, router) {
		config.title = 'Aurelia';
		config.map([
			{ route: ['dashboard'], name: 'dashboard', moduleId: 'dashboard/dashboard', nav: true, materialIconName: 'dashboard' },
			{ route: ['fridge'], name: 'fridge', moduleId: 'fridge/fridge', nav: true, materialIconName: 'kitchen' },
			{ route: ['search', ''], name: 'search', moduleId: 'search/search', nav: true, materialIconName: 'search' },
			{ route: ['plan'], name: 'plan', moduleId: 'plan/plan', nav: true, materialIconName: 'view_module' },
			{ route: ['settings'], name: 'settings', moduleId: 'settings/settings', nav: true, materialIconName: 'settings' },
			{ route: ['recipe/:id'], name: 'recipe', moduleId: 'recipes/recipe-detail', nav: false}
		]);
		config.mapUnknownRoutes({ route: ['notFound'], name: 'notFound', moduleId: 'not-found/not-found'});
		this.router = router;
	}
}
