define('app',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var App = exports.App = function () {
		function App() {
			_classCallCheck(this, App);
		}

		App.prototype.configureRouter = function configureRouter(config, router) {
			config.title = 'Aurelia';
			config.map([{ route: ['dashboard'], name: 'dashboard', moduleId: 'dashboard/dashboard', nav: true, materialIconName: 'dashboard' }, { route: ['fridge'], name: 'fridge', moduleId: 'fridge/fridge', nav: true, materialIconName: 'kitchen' }, { route: ['search', ''], name: 'search', moduleId: 'search/search', nav: true, materialIconName: 'search' }, { route: ['plan'], name: 'plan', moduleId: 'plan/plan', nav: true, materialIconName: 'view_module' }, { route: ['settings'], name: 'settings', moduleId: 'settings/settings', nav: true, materialIconName: 'settings' }, { route: ['recipe/:id'], name: 'recipe', moduleId: 'recipes/recipe-detail', nav: false }]);
			config.mapUnknownRoutes({ route: ['notFound'], name: 'notFound', moduleId: 'not-found/not-found' });
			this.router = router;
		};

		return App;
	}();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', 'auth/auth-service'], function (exports, _environment, _authService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      var auth = aurelia.container.get(_authService.AuthService);
      var root = 'app';

      aurelia.setRoot(root);
    });
  }
});
define('auth/auth-service',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.AuthService = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var AuthService = exports.AuthService = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _aureliaFetchClient.HttpClient), _dec(_class = function () {
		function AuthService(Aurelia, HttpClient) {
			_classCallCheck(this, AuthService);

			this.aurelia = Aurelia;
			this.httpClient = HttpClient;
			this.httpClient.configure(function (config) {
				config.useStandardConfiguration().withBaseUrl('//localhost:8080/');
			});
			this.session = localStorage.authToken || null;
		}

		AuthService.prototype.isAuthed = function isAuthed() {
			return this.session !== null;
		};

		AuthService.prototype.login = function login(email, password) {
			var _this = this;

			return this.httpClient.fetch('login', {
				method: 'post',
				body: (0, _aureliaFetchClient.json)({ email: email, password: password })
			}).then(function (res) {
				return res.json();
			}).then(function (authToken) {
				console.log('', authToken);
				localStorage.authToken = authToken;
				_this.session = authToken;
				_this.aurelia.setRoot('app');
			});
		};

		AuthService.prototype.signup = function signup(email, password) {
			var user = { email: email, password: password };
			return this.httpClient.fetch('createUser', {
				method: 'post',
				body: (0, _aureliaFetchClient.json)(user)
			}).then(function (res) {
				return res.json();
			});
		};

		return AuthService;
	}()) || _class);
});
define('auth/login',['exports', 'aurelia-framework', './auth-service'], function (exports, _aureliaFramework, _authService) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Login = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _authService.AuthService), _dec(_class = function () {
		function Login(aurelia, authService) {
			_classCallCheck(this, Login);

			this.email = 'test@email.com';
			this.password = '123';
			this.error = '';

			this.aurelia = aurelia;
			this.authService = authService;
		}

		Login.prototype.login = function login() {
			this.authService.login(this.email, this.password);
		};

		Login.prototype.signup = function signup() {
			this.aurelia.setRoot('auth/signup');
		};

		return Login;
	}()) || _class);
});
define('auth/signup',['exports', 'aurelia-framework', './auth-service'], function (exports, _aureliaFramework, _authService) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Signup = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _authService.AuthService), _dec(_class = function () {
		function Signup(aurelia, authService) {
			_classCallCheck(this, Signup);

			this.email = '';
			this.password = '';
			this.passwordConfirm = '';
			this.error = '';

			this.aurelia = aurelia;
			this.authService = authService;
		}

		Signup.prototype.backToLogin = function backToLogin() {
			this.aurelia.setRoot('auth/login');
		};

		Signup.prototype.signup = function signup() {
			if (this.email && this.password && this.password === this.passwordConfirm) {
				this.authService.signup(this.email, this.password).then(function (res) {
					if (res.status === 'success') {
						console.log('success', res);
					} else {
						console.log('error', res.message);
					}
				});;
			}
		};

		return Signup;
	}()) || _class);
});
define('dashboard/dashboard',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var Dashboard = exports.Dashboard = function Dashboard() {
		_classCallCheck(this, Dashboard);
	};
});
define('fridge/fridge',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var fridge = exports.fridge = function () {
		function fridge() {
			_classCallCheck(this, fridge);

			this.fridge = this.getFridgeItems();
		}

		fridge.prototype.getFridgeItems = function getFridgeItems() {
			return [{ name: 'Banana', quantity: 3, expiration: '5 days', thumbnail: 'src/assets/img/banana.png' }, { name: 'Potato', quantity: 4, expiration: '12 days', thumbnail: 'src/assets/img/potato.png' }, { name: 'Egg', quantity: 12, expiration: '17 days', thumbnail: 'src/assets/img/egg.png' }, { name: 'Dr Pepper', quantity: 6, expiration: 'Never', thumbnail: 'src/assets/img/drpepper.png' }];
		};

		return fridge;
	}();
});
define('not-found/not-found',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var NotFound = exports.NotFound = function NotFound() {
		_classCallCheck(this, NotFound);
	};
});
define('plan/plan',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var Plan = exports.Plan = function Plan() {
		_classCallCheck(this, Plan);
	};
});
define('recipes/recipe-detail',['exports', 'aurelia-framework', 'jquery', 'aurelia-event-aggregator', 'aurelia-router', '../shared/spoonacular-api', '../shared/app-state'], function (exports, _aureliaFramework, _jquery, _aureliaEventAggregator, _aureliaRouter, _spoonacularApi, _appState) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.RecipeDetail = undefined;

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var RecipeDetail = exports.RecipeDetail = (_dec = (0, _aureliaFramework.inject)(_spoonacularApi.SpoonacularApi, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router, _appState.AppState), _dec(_class = function () {
		function RecipeDetail(SpoonacularApi, EventAggregator, Router, AppState) {
			_classCallCheck(this, RecipeDetail);

			this.api = SpoonacularApi;
			this.ea = EventAggregator;
			this.router = Router;
			this.as = AppState;
		}

		RecipeDetail.prototype.activate = function activate(params, routeConfig) {
			var _this = this;

			this.as.recipes = this.as.recipes || {};
			if (!this.as.recipes[params.id]) {
				this.api.getRecipeInformation(params.id, true).then(function (res) {
					_this.recipe = res;
					_this.as.recipes[params.id] = res;
				});
			} else {
				this.recipe = this.as.recipes[params.id];
			}
		};

		RecipeDetail.prototype.back = function back() {
			if (!this.router.previousLocation || this.router.previousLocation === this.router.currentInstruction.fragment) {
				this.router.navigateToRoute('search');
			} else {
				this.router.navigateBack();
			}
		};

		return RecipeDetail;
	}()) || _class);
});
define('resources/index',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.configure = configure;
	function configure(config) {
		config.globalResources(['./elements/loading-indicator']);
	}
});
define('search/fg-elastic-search',[], function () {});
define('search/search',['exports', 'aurelia-framework', 'jquery', 'aurelia-event-aggregator', '../shared/events-hub', 'aurelia-router', '../shared/app-state'], function (exports, _aureliaFramework, _jquery, _aureliaEventAggregator, _eventsHub, _aureliaRouter, _appState) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Search = undefined;

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var Search = exports.Search = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _aureliaRouter.Router, _appState.AppState), _dec(_class = function () {
		function Search(ea, Router, AppState) {
			var _this = this;

			_classCallCheck(this, Search);

			this.ea = ea;
			this.router = Router;
			this.ea.subscribe(_eventsHub.ResultsFound, function (res) {
				return _this.showResults(res);
			});
			this.filters = this.filters || {};
			this.countries = this.countries || this.getCountries();
			this.intolerances = this.intolerances || this.getIntolerances();
			this.as = AppState;
			console.log('', 'construct');
		}

		Search.prototype.activate = function activate(params, routeConfig, navigationInstruction) {
			console.log('', 'activate');
			console.log('search stuff', this.as.search);
			var keys = Object.keys(this.as.search);
			for (var i = 0, len = keys.length; i < len; i++) {
				var key = keys[i];
				this[key] = this.as.search[key];
			}
		};

		Search.prototype.deactivate = function deactivate() {
			console.log('', this.filters);
			this.as.search = this.as.search || {};
			this.as.search.filters = this.filters;
			this.as.search.baseUri = this.baseUri;
			this.as.search.results = this.results;
			this.as.search.countries = this.countries;
			this.as.search.intolerances = this.intolerances;
		};

		Search.prototype.showResults = function showResults(res) {
			this.baseUri = res.data.baseUri;
			this.results = res.data.results;
		};

		Search.prototype.countriesChanged = function countriesChanged() {
			console.log('', this.countries);
		};

		Search.prototype.getCountries = function getCountries() {
			return [{ name: 'chinese', thumbnail: 'src/assets/img/flags/china.png' }, { name: 'french', thumbnail: 'src/assets/img/flags/france.png' }, { name: 'greek', thumbnail: 'src/assets/img/flags/greece.png' }, { name: 'indian', thumbnail: 'src/assets/img/flags/india.png' }, { name: 'italian', thumbnail: 'src/assets/img/flags/italy.png' }, { name: 'japanese', thumbnail: 'src/assets/img/flags/japan.png' }, { name: 'korean', thumbnail: 'src/assets/img/flags/korea.png' }, { name: 'mexican', thumbnail: 'src/assets/img/flags/mexico.png' }, { name: 'thai', thumbnail: 'src/assets/img/flags/thailand.png' }];
		};

		Search.prototype.getIntolerances = function getIntolerances() {
			return [{ name: 'dairy', thumbnail: 'src/assets/img/allergens/dairy-free.png' }, { name: 'egg', thumbnail: 'src/assets/img/allergens/egg-free.png' }, { name: 'gluten', thumbnail: 'src/assets/img/allergens/gluten-free.png' }, { name: 'peanut', thumbnail: 'src/assets/img/allergens/peanut-free.png' }, { name: 'shellfish', thumbnail: 'src/assets/img/allergens/crustean-free.png' }, { name: 'soy', thumbnail: 'src/assets/img/allergens/soya-free.png' }, { name: 'tree nut', thumbnail: 'src/assets/img/allergens/nut-free.png' }];
		};

		Search.prototype.parseFilter = function parseFilter(type, array) {
			var me = this;
			var filterArray = [];
			var filterString = '';
			for (var i = 0, len = array.length; i < len; i++) {
				var item = array[i];
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
		};

		Search.prototype.toggleCountry = function toggleCountry(country) {
			country.active = !country.active;
			this.parseFilter('cuisine', this.countries);
			this.ea.publish(new _eventsHub.FiltersUpdated(this.filters));
		};

		Search.prototype.toggleIntolerance = function toggleIntolerance(allergen) {
			allergen.active = !allergen.active;
			this.parseFilter('intolerances', this.intolerances);
			this.ea.publish(new _eventsHub.FiltersUpdated(this.filters));
		};

		Search.prototype.viewRecipe = function viewRecipe(recipe) {
			console.log('', recipe);
			this.router.navigateToRoute('recipe', { id: recipe.id });
		};

		return Search;
	}()) || _class);
});
define('settings/settings',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var settings = exports.settings = function settings() {
		_classCallCheck(this, settings);
	};
});
define('shared/app-state',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var AppState = exports.AppState = function AppState() {
		_classCallCheck(this, AppState);

		this.search = {};
	};
});
define('shared/events-hub',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var ResultsFound = exports.ResultsFound = function ResultsFound(data) {
		_classCallCheck(this, ResultsFound);

		this.data = data;
	};

	var FiltersUpdated = exports.FiltersUpdated = function FiltersUpdated(filters) {
		_classCallCheck(this, FiltersUpdated);

		this.filters = filters;
	};
});
define('shared/fg-suggest-search',['exports', 'aurelia-framework', 'jquery', './spoonacular-api', 'aurelia-event-aggregator', './events-hub'], function (exports, _aureliaFramework, _jquery, _spoonacularApi, _aureliaEventAggregator, _eventsHub) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.FgSuggestSearch = undefined;

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _initDefineProp(target, property, descriptor, context) {
		if (!descriptor) return;
		Object.defineProperty(target, property, {
			enumerable: descriptor.enumerable,
			configurable: descriptor.configurable,
			writable: descriptor.writable,
			value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
		});
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
		var desc = {};
		Object['ke' + 'ys'](descriptor).forEach(function (key) {
			desc[key] = descriptor[key];
		});
		desc.enumerable = !!desc.enumerable;
		desc.configurable = !!desc.configurable;

		if ('value' in desc || desc.initializer) {
			desc.writable = true;
		}

		desc = decorators.slice().reverse().reduce(function (desc, decorator) {
			return decorator(target, property, desc) || desc;
		}, desc);

		if (context && desc.initializer !== void 0) {
			desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
			desc.initializer = undefined;
		}

		if (desc.initializer === void 0) {
			Object['define' + 'Property'](target, property, desc);
			desc = null;
		}

		return desc;
	}

	function _initializerWarningHelper(descriptor, context) {
		throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
	}

	var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

	var FgSuggestSearch = exports.FgSuggestSearch = (_dec = (0, _aureliaFramework.inject)(_spoonacularApi.SpoonacularApi, Element, _aureliaEventAggregator.EventAggregator), _dec(_class = (_class2 = function () {
		function FgSuggestSearch(SpoonacularApi, Element, EventAggregator) {
			var _this = this;

			_classCallCheck(this, FgSuggestSearch);

			_initDefineProp(this, 'searchFocus', _descriptor, this);

			_initDefineProp(this, 'searchTerm', _descriptor2, this);

			this.api = SpoonacularApi;
			this.elem = Element;
			this.ea = EventAggregator;
			this.placeholder = 'search recipes';

			this.ea.subscribe(_eventsHub.FiltersUpdated, function (data) {
				return _this.filters = data.filters;
			});
			this.filters = {};
		}

		FgSuggestSearch.prototype.inputHandler = function inputHandler(e) {
			var _this2 = this;

			var key = e.keyCode;
			var disallowedKeys = [13, 27, 37, 38, 39, 40];

			if (disallowedKeys.indexOf(key) > -1) {
				if (key === 38) {
					this.selectPrevSuggestion();
				} else if (key === 40) {
					this.selectNextSuggestion();
				} else if (key === 13) {
					(function () {
						if (_this2.displaySuggestions && _this2.selectedSuggestion > -1) {
							_this2.searchTerm = _this2.suggestions[_this2.selectedSuggestion].title;
						}

						var me = _this2;
						setTimeout(function () {
							me.searchRecipes();
						}, 150);
					})();
				}
			} else {
				return true;
			}
		};

		FgSuggestSearch.prototype.searchRecipes = function searchRecipes() {
			var _this3 = this;

			this.api.searchRecipes(this.searchTerm, this.filters.cuisineString, this.filters.dietString, this.filters.excludeIngredientsString, this.filters.intolerancesString, this.filters.limitLicenseString, this.filters.numberString, this.filters.offsetString, this.filters.typeString).then(function (res) {
				console.log('recipes found', res);
				_this3.ea.publish(new _eventsHub.ResultsFound(res));
				_this3.displaySuggestions = false;
			});
		};

		FgSuggestSearch.prototype.searchFocusChanged = function searchFocusChanged(newValue, oldValue) {
			if (!newValue) {
				this.displaySuggestions = false;
			}
		};

		FgSuggestSearch.prototype.searchTermChanged = function searchTermChanged(newValue, oldValue) {
			var _this4 = this;

			this.selectedSuggestion = -1;
			this.api.autocompleteRecipeSearch(newValue).then(function (suggestions) {
				if (suggestions.length) {
					_this4.suggestions = suggestions;
					_this4.displaySuggestions = true;
				} else {
					_this4.displaySuggestions = false;
				}
			});
		};

		FgSuggestSearch.prototype.selectPrevSuggestion = function selectPrevSuggestion() {
			if (this.suggestions && this.suggestions.length) {
				this.selectedSuggestion - 1 > -1 ? this.selectedSuggestion-- : this.selectedSuggestion = this.suggestions.length - 1;
			}
		};

		FgSuggestSearch.prototype.selectNextSuggestion = function selectNextSuggestion() {
			if (this.suggestions && this.suggestions.length) {
				this.selectedSuggestion + 1 < this.suggestions.length ? this.selectedSuggestion++ : this.selectedSuggestion = 0;
			}
		};

		return FgSuggestSearch;
	}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'searchFocus', [_aureliaFramework.bindable], {
		enumerable: true,
		initializer: null
	}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'searchTerm', [_aureliaFramework.bindable], {
		enumerable: true,
		initializer: null
	})), _class2)) || _class);
});
define('shared/fg-tags-search',[], function () {});
define('shared/spoonacular-api',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.SpoonacularApi = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _dec, _class;

	var SpoonacularApi = exports.SpoonacularApi = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
		function SpoonacularApi(HttpClient) {
			_classCallCheck(this, SpoonacularApi);

			this.httpClient = HttpClient;
			this.httpClient.configure(function (config) {
				config.useStandardConfiguration().withBaseUrl('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/').withDefaults({
					credentials: 'same-origin',
					headers: {
						'X-Mashape-Key': 'rpFyX1EbOJmsh06LKs9gjfJAKemgp13isabjsnFh5UrUSM2KMd',
						'Accept': 'application/json'
					}
				});
			});
			this.session = localStorage.authToken || null;
		}

		SpoonacularApi.prototype.autocompleteRecipeSearch = function autocompleteRecipeSearch(query, number) {
			var appendage = '?query=' + query + '&number=' + (number || 3);

			return this.httpClient.fetch('recipes/autocomplete' + appendage, {
				method: 'get'
			}).then(function (res) {
				return res.json();
			});
		};

		SpoonacularApi.prototype.getRecipeInformation = function getRecipeInformation(id, includeNutrition) {
			return this.httpClient.fetch('recipes/' + id + ('/information?includeNutrition=' + includeNutrition), {
				method: 'get'
			}).then(function (res) {
				return res.json();
			});
		};

		SpoonacularApi.prototype.searchRecipes = function searchRecipes(query, cuisine, diet, excludeIngredients, intolerances, limitLicense, number, offset, type) {
			console.log('Search Args', arguments);
			var appendage = '?query=' + query + '&number=' + (number || 20);
			if (cuisine) {
				appendage += '&cuisine=' + cuisine;
			}
			if (diet) {
				appendage += '&cuisine=' + diet;
			}
			if (excludeIngredients) {
				appendage += '&cuisine=' + excludeIngredients;
			}
			if (intolerances) {
				appendage += '&intolerances=' + intolerances;
			}
			if (limitLicense) {
				appendage += '&cuisine=' + limitLicense;
			}
			if (offset) {
				appendage += '&cuisine=' + offset;
			}
			if (type) {
				appendage += '&cuisine=' + type;
			}

			return this.httpClient.fetch('recipes/search' + appendage, {
				method: 'get'
			}).then(function (res) {
				return res.json();
			});
		};

		return SpoonacularApi;
	}()) || _class);
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.LoadingIndicator = undefined;

	var nprogress = _interopRequireWildcard(_nprogress);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
		function _class() {
			_classCallCheck(this, _class);
		}

		_class.prototype.loadingChanged = function loadingChanged(newValue) {
			if (newValue) {
				nprogress.start();
			} else {
				nprogress.done();
			}
		};

		return _class;
	}());
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"assets/css/app.css\"></require>\n    <require from=\"menu/navbar.html\"></require>\n    <nav as-element=\"navbar\" router.bind=\"router\"></nav>\n    <router-view></router-view>\n    <div class=\"mobile-msg\">\n    \tplease switch to mobile view (mobile-sized window)\n    </div>\n</template>\n"; });
define('text!auth/login.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"assets/css/app.css\"></require>\n    <div class=\"login-view\">\n    \t<div style=\"text-align: center\">Please switch to mobile view</div>\n        <br>\n        <form class=\"login-form\">\n            <input class=\"login-input\" type=\"text\" value.bind=\"email\" placeholder=\"Email\">\n            <input class=\"login-input\" type=\"password\" value.bind=\"password\" placeholder=\"Password\">\n            <button class=\"login-btn\" type=\"submit\" click.delegate=\"login()\">Login</button>\n        </form>\n        <div class=\"signup-btn\" click.delegate=\"signup()\">Signup</div>\n    </div>\n</template>\n"; });
define('text!auth/signup.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"assets/css/app.css\"></require>\n    <div class=\"signup-view\">\n        <form class=\"signup-form\">\n            <input class=\"signup-input\" type=\"text\" value.bind=\"email\" placeholder=\"Email\">\n            <input class=\"signup-input\" type=\"password\" value.bind=\"password\" placeholder=\"Password\">\n            <input class=\"signup-input\" type=\"password\" value.bind=\"passwordConfirm\" placeholder=\"Password Confirm\">\n            <button class=\"signup-btn\" type=\"submit\" click.delegate=\"signup()\">Signup</button>\n        </form>\n        <div class=\"back-btn\" click.delegate=\"backToLogin()\"><i class=\"ionicons ion-ios-arrow-back\"></i>Back to Login</div>\n    </div>\n</template>\n"; });
define('text!dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"under-construction-flat\">\n        <div class=\"card\">\n            <div class=\"icon\"><i class=\"mega-octicon octicon-tools\"></i></div>\n            <div class=\"text\">under construction</div>\n        </div>\n    </div>\n<!--     <section class=\"dashboard-view\">\n        <div class=\"dashboard-ctrl\">\n            <div class=\"ctrl-title\">Dashboard</div>\n            <div class=\"ctrl-spacer\"></div>\n            <div class=\"ctrl-setting ctrl-btn ${displaySettings ? 'is-active' : ''}\" click.delegate=\"displaySettings = !displaySettings\"><i class=\"material-icons\">tune</i></div>\n        </div>\n        <div class=\"notes\">This is the temporary dashboard until core features are built and consolidated</div>\n    </section> -->\n</template>"; });
define('text!fridge/fridge.html', ['module'], function(module) { module.exports = "<template>\n    <!-- <require from=\"../shared/fg-tags-search\"></require>\n            <form class=\"search-form\">\n            <fg-tags-search></fg-tags-search>\n        </form> -->\n    <section class=\"fridge-view\">\n        <div class=\"fridge-ctrl\">\n            <div class=\"ctrl-title\">Fridge</div>\n            <div class=\"ctrl-spacer\"></div>\n            <div class=\"ctrl-setting ctrl-btn\"><i class=\"material-icons\">tune</i></div>\n        </div>\n        <ul class=\"fridge-items\">\n            <li class=\"special-fridge-item\">\n                <div class=\"name\">Apple<span class=\"mult\"><i class=\"material-icons\">clear</i></span><span class=\"quantity\">7</span></div>\n                <div class=\"calorie\"><span class=\"value\">135 </span><span class=\"unit\">Cal</span></div>\n            </li>\n            <li class=\"fridge-item\" repeat.for=\"item of fridge\">\n                <div class=\"item-icon\" css=\"background-image: url(${item.thumbnail})\"></div>\n                <div class=\"item-details\">\n                    <div class=\"item-name\">${item.name}</div>\n                    <div class=\"item-expiry\">\n                        <span class=\"label\">Expires: </span>\n                        <span class=\"text\">${item.expiration}</span>\n                    </div>\n                </div>\n                <div class=\"item-quantity\">\n                    ${item.quantity}\n                </div>\n            </li>\n        </ul>\n    </section>\n    <div class=\"under-construction float\">\n        <div class=\"card\">\n            <div class=\"icon\"><i class=\"mega-octicon octicon-tools\"></i></div>\n            <div class=\"text\">under construction</div>\n        </div>\n    </div>\n</template>\n"; });
define('text!menu/navbar.html', ['module'], function(module) { module.exports = "<template class=\"navbar\" bindable=\"router\">\n    <div repeat.for=\"row of router.navigation\" click.delegate=\"router.navigate(row.href)\" class=\"navbar-tab ${row.isActive ? 'is-active' : ''}\"><i class=\"material-icons\">${row.config.materialIconName}</i></div>\n</template>\n"; });
define('text!assets/css/app.css', ['module'], function(module) { module.exports = "@charset \"UTF-8\";\n@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800);\n@import url(https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900);\n@import url(https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,700,800,900);\n@import url(https://fonts.googleapis.com/css?family=Lato:400,100,300,700,900);\n@import url(https://fonts.googleapis.com/css?family=Cormorant+Garamond:400,300,300italic,400italic,500,500italic,600,600italic,700,700italic);\n@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css);\n@import url(https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css);\n@import url(https://fonts.googleapis.com/icon?family=Material+Icons);\n@import url(https://cdnjs.cloudflare.com/ajax/libs/octicons/3.5.0/octicons.min.css);\n@import url(https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css);\nhtml {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -o-box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  box-sizing: border-box;\n  font-family: sans-serif;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%; }\n\n*, *:before, *:after {\n  -webkit-box-sizing: inherit;\n  -moz-box-sizing: inherit;\n  -o-box-sizing: inherit;\n  -ms-box-sizing: inherit;\n  box-sizing: inherit; }\n\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, i, u, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, fieldset, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  vertical-align: baseline;\n  font: inherit;\n  font-size: 100%; }\n\nol, ul {\n  list-style: none; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after, q:before, q:after {\n  content: \"\";\n  content: none; }\n\n[class*='col-'] {\n  -webkit-transition: all 300ms;\n  -o-transition: all 300ms;\n  -moz-transition: all 300ms;\n  transition: all 300ms; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n[hidden], template {\n  display: none; }\n\nscript {\n  display: none !important; }\n\na {\n  text-decoration: none;\n  -webkit-user-drag: none;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-tap-highlight-color: transparent; }\n  a[href]:hover {\n    cursor: pointer; }\n\na, button, :focus, a:focus, button:focus, a:active, a:hover {\n  outline: 0; }\n\nbody {\n  line-height: 1; }\n\nb, strong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\ncode, kbd, pre, samp {\n  font-size: 1em;\n  font-family: monospace, serif; }\n\npre {\n  white-space: pre-wrap; }\n\nq {\n  quotes: \"“\" \"”\" \"‘\" \"’\"; }\n\nsmall {\n  font-size: 80%; }\n\nsub, sup {\n  position: relative;\n  vertical-align: baseline;\n  font-size: 75%;\n  line-height: 0; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nfieldset {\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n  border: 1px solid #c0c0c0; }\n\nlegend {\n  padding: 0;\n  border: 0; }\n\nbutton, input, select, textarea {\n  margin: 0;\n  font-size: 100%;\n  font-family: inherit;\n  outline-offset: 0;\n  outline-style: none;\n  outline-width: 0;\n  -webkit-font-smoothing: inherit;\n  background-image: none; }\n\nbutton, input {\n  line-height: normal; }\n\nbutton, html input[type=\"button\"], input[type=\"reset\"], input[type=\"submit\"] {\n  cursor: pointer;\n  -webkit-appearance: button; }\n\ninput[type=\"search\"] {\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  -webkit-appearance: textfield; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button, input[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nbutton::-moz-focus-inner, input::-moz-focus-inner {\n  padding: 0;\n  border: 0; }\n\ntextarea {\n  overflow: auto;\n  vertical-align: top; }\n\nimg {\n  -webkit-user-drag: none; }\n\ntable {\n  border-spacing: 0;\n  border-collapse: collapse; }\n\nh1, h2, h3, h4, h5, h6 {\n  color: black;\n  font-weight: 500;\n  line-height: 1.2;\n  margin-bottom: 9.5px; }\n  h1 small, h2 small, h3 small, h4 small, h5 small, h6 small {\n    font-weight: normal;\n    line-height: 1; }\n\nh1 {\n  font-size: 36px; }\n\nh2 {\n  font-size: 30px; }\n\nh3 {\n  font-size: 24px; }\n\nh4 {\n  font-size: 18px; }\n\nh5 {\n  font-size: 14px; }\n\nh6 {\n  font-size: 12px; }\n\n.stagger-transition.ng-enter-stagger {\n  -moz-transition-delay: 50ms;\n    -o-transition-delay: 50ms;\n       transition-delay: 50ms;\n  -webkit-transition-delay: 50ms;\n  -moz-transition-duration: 0;\n    -o-transition-duration: 0;\n       transition-duration: 0;\n  -webkit-transition-duration: 0; }\n\n.stagger-transition.ng-enter {\n  -o-transition: 200ms cubic-bezier(0.4, 0, 1, 1) all;\n  -moz-transition: 200ms cubic-bezier(0.4, 0, 1, 1) all;\n  transition: 200ms cubic-bezier(0.4, 0, 1, 1) all;\n  -webkit-transition: 200ms cubic-bezier(0.4, 0, 1, 1) all;\n  opacity: 0; }\n\n.stagger-transition.ng-enter-active {\n  opacity: 1; }\n\n.loader {\n  position: absolute;\n  top: 50px;\n  right: 0;\n  bottom: 0;\n  left: 60px;\n  background-color: rgba(0, 0, 0, 0.15);\n  z-index: 30; }\n  @media screen and (min-width: 768px) {\n    .loader {\n      top: 80px;\n      bottom: 30px; } }\n  .loader.ng-hide-remove {\n    -webkit-animation: 500ms fadeIn;\n       -moz-animation: 500ms fadeIn;\n         -o-animation: 500ms fadeIn;\n            animation: 500ms fadeIn; }\n  .loader.ng-hide-add {\n    -webkit-animation: 500ms fadeOut;\n       -moz-animation: 500ms fadeOut;\n         -o-animation: 500ms fadeOut;\n            animation: 500ms fadeOut; }\n  .loader .sk-cube-grid {\n    width: 40px;\n    height: 40px;\n    margin: 100px auto; }\n    .loader .sk-cube-grid .sk-cube {\n      width: 33%;\n      height: 33%;\n      background-color: #2196F3;\n      float: left;\n      -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;\n      -moz-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;\n        -o-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;\n           animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; }\n    .loader .sk-cube-grid .sk-cube1 {\n      -webkit-animation-delay: 0.2s;\n      -moz-animation-delay: 0.2s;\n        -o-animation-delay: 0.2s;\n           animation-delay: 0.2s; }\n    .loader .sk-cube-grid .sk-cube2 {\n      -webkit-animation-delay: 0.3s;\n      -moz-animation-delay: 0.3s;\n        -o-animation-delay: 0.3s;\n           animation-delay: 0.3s; }\n    .loader .sk-cube-grid .sk-cube3 {\n      -webkit-animation-delay: 0.4s;\n      -moz-animation-delay: 0.4s;\n        -o-animation-delay: 0.4s;\n           animation-delay: 0.4s; }\n    .loader .sk-cube-grid .sk-cube4 {\n      -webkit-animation-delay: 0.1s;\n      -moz-animation-delay: 0.1s;\n        -o-animation-delay: 0.1s;\n           animation-delay: 0.1s; }\n    .loader .sk-cube-grid .sk-cube5 {\n      -webkit-animation-delay: 0.2s;\n      -moz-animation-delay: 0.2s;\n        -o-animation-delay: 0.2s;\n           animation-delay: 0.2s; }\n    .loader .sk-cube-grid .sk-cube6 {\n      -webkit-animation-delay: 0.3s;\n      -moz-animation-delay: 0.3s;\n        -o-animation-delay: 0.3s;\n           animation-delay: 0.3s; }\n    .loader .sk-cube-grid .sk-cube7 {\n      -webkit-animation-delay: 0s;\n      -moz-animation-delay: 0s;\n        -o-animation-delay: 0s;\n           animation-delay: 0s; }\n    .loader .sk-cube-grid .sk-cube8 {\n      -webkit-animation-delay: 0.1s;\n      -moz-animation-delay: 0.1s;\n        -o-animation-delay: 0.1s;\n           animation-delay: 0.1s; }\n    .loader .sk-cube-grid .sk-cube9 {\n      -webkit-animation-delay: 0.2s;\n      -moz-animation-delay: 0.2s;\n        -o-animation-delay: 0.2s;\n           animation-delay: 0.2s; }\n\n@-webkit-keyframes sk-cubeGridScaleDelay {\n  0%, 70%, 100% {\n    -webkit-transform: scale3D(1, 1, 1);\n    transform: scale3D(1, 1, 1); }\n  35% {\n    -webkit-transform: scale3D(0, 0, 1);\n    transform: scale3D(0, 0, 1); } }\n\n@-moz-keyframes sk-cubeGridScaleDelay {\n  0%, 70%, 100% {\n    -webkit-transform: scale3D(1, 1, 1);\n    -moz-transform: scale3D(1, 1, 1);\n         transform: scale3D(1, 1, 1); }\n  35% {\n    -webkit-transform: scale3D(0, 0, 1);\n    -moz-transform: scale3D(0, 0, 1);\n         transform: scale3D(0, 0, 1); } }\n\n@-o-keyframes sk-cubeGridScaleDelay {\n  0%, 70%, 100% {\n    -webkit-transform: scale3D(1, 1, 1);\n    -o-transform: scale3D(1, 1, 1);\n       transform: scale3D(1, 1, 1); }\n  35% {\n    -webkit-transform: scale3D(0, 0, 1);\n    -o-transform: scale3D(0, 0, 1);\n       transform: scale3D(0, 0, 1); } }\n\n@keyframes sk-cubeGridScaleDelay {\n  0%, 70%, 100% {\n    -webkit-transform: scale3D(1, 1, 1);\n    -moz-transform: scale3D(1, 1, 1);\n      -o-transform: scale3D(1, 1, 1);\n         transform: scale3D(1, 1, 1); }\n  35% {\n    -webkit-transform: scale3D(0, 0, 1);\n    -moz-transform: scale3D(0, 0, 1);\n      -o-transform: scale3D(0, 0, 1);\n         transform: scale3D(0, 0, 1); } }\n\n.card-1, .fridge-view .fridge-ctrl, .search-view .search-ctrl, .fg-suggest-search .search-group, .fg-suggest-search .suggestions-list, .recipe-detail-view .recipe-ctrl, .dashboard-view .dashboard-ctrl, .plan-view .plan-ctrl {\n  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); }\n\n.card-2, .fg-modal, .under-construction .card {\n  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n\n.card-3 {\n  -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);\n          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n\n.card-4 {\n  -webkit-box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);\n          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); }\n\n.card-5 {\n  -webkit-box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);\n          box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22); }\n\n.flex-xy, .loader, .fg-backdrop, .login-view, .signup-view, .navbar .navbar-tab, .fg-suggest-search .search-btn, .under-construction, .under-construction .card, .under-construction-flat, .under-construction-flat .card, .mobile-msg {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n     -moz-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n     -moz-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.aspect-square {\n  position: relative; }\n  .aspect-square:before {\n    display: block;\n    content: \"\";\n    width: 100%;\n    padding-top: 100%; }\n  .aspect-square > .content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0; }\n\n.aspect-hd {\n  position: relative; }\n  .aspect-hd:before {\n    display: block;\n    content: \"\";\n    width: 100%;\n    padding-top: 56.25%; }\n  .aspect-hd > .content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0; }\n\n.aspect-phi {\n  position: relative; }\n  .aspect-phi:before {\n    display: block;\n    content: \"\";\n    width: 100%;\n    padding-top: 61.8047%; }\n  .aspect-phi > .content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0; }\n\n.inline-block {\n  display: inline-block; }\n\n.pointer-events-off {\n  pointer-events: none; }\n\n.pointer-events-on {\n  pointer-events: auto; }\n\n.fg-row, .fg-row-padded {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 100%; }\n  .fg-row.wrap, .wrap.fg-row-padded {\n    -webkit-flex-wrap: wrap;\n        -ms-flex-wrap: wrap;\n            flex-wrap: wrap; }\n\n.fg-row-padded {\n  padding: 0 5px; }\n  .fg-row-padded.wrap {\n    -webkit-flex-wrap: wrap;\n        -ms-flex-wrap: wrap;\n            flex-wrap: wrap; }\n  .fg-row-padded > [class*='fg-col'] {\n    padding: 0 5px; }\n\n.fg-col, .fg-col-10, .fg-col-20, .fg-col-25, .fg-col-33, .fg-col-38, .fg-col-40, .fg-col-50, .fg-col-60, .fg-col-62, .fg-col-66, .fg-col-75, .fg-col-80, .fg-col-90, .fg-col-100 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 100%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 100%;\n          flex: 0 0 100%;\n  display: block;\n  width: 100%; }\n\n.fg-col-10 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 10%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 10%;\n          flex: 0 0 10%;\n  max-width: 10%; }\n\n.fg-col-20 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 20%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 20%;\n          flex: 0 0 20%;\n  max-width: 20%; }\n\n.fg-col-25 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 25%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 25%;\n          flex: 0 0 25%;\n  max-width: 25%; }\n\n.fg-col-33 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 33.3333%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 33.3333%;\n          flex: 0 0 33.3333%;\n  max-width: 33.3333%; }\n\n.fg-col-38 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 38%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 38%;\n          flex: 0 0 38%;\n  max-width: 38%; }\n\n.fg-col-40 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 40%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 40%;\n          flex: 0 0 40%;\n  max-width: 40%; }\n\n.fg-col-50 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 50%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 50%;\n          flex: 0 0 50%;\n  max-width: 50%; }\n\n.fg-col-60 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 60%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 60%;\n          flex: 0 0 60%;\n  max-width: 60%; }\n\n.fg-col-62 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 62%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 62%;\n          flex: 0 0 62%;\n  max-width: 62%; }\n\n.fg-col-66 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 66.6666%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 66.6666%;\n          flex: 0 0 66.6666%;\n  max-width: 66.6666%; }\n\n.fg-col-75 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 75%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 75%;\n          flex: 0 0 75%;\n  max-width: 75%; }\n\n.fg-col-80 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 80%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 80%;\n          flex: 0 0 80%;\n  max-width: 80%; }\n\n.fg-col-90 {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 90%;\n     -moz-box-flex: 0;\n      -ms-flex: 0 0 90%;\n          flex: 0 0 90%;\n  max-width: 90%; }\n\n.fg-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 110;\n  background-color: rgba(0, 0, 0, 0.4); }\n  .fg-backdrop.ng-hide-remove {\n    -webkit-animation: 300ms fadeIn cubic-bezier(0.4, 0, 0.2, 1);\n       -moz-animation: 300ms fadeIn cubic-bezier(0.4, 0, 0.2, 1);\n         -o-animation: 300ms fadeIn cubic-bezier(0.4, 0, 0.2, 1);\n            animation: 300ms fadeIn cubic-bezier(0.4, 0, 0.2, 1); }\n  .fg-backdrop.ng-hide-add {\n    -webkit-animation: 300ms fadeOut cubic-bezier(0.4, 0, 0.2, 1);\n       -moz-animation: 300ms fadeOut cubic-bezier(0.4, 0, 0.2, 1);\n         -o-animation: 300ms fadeOut cubic-bezier(0.4, 0, 0.2, 1);\n            animation: 300ms fadeOut cubic-bezier(0.4, 0, 0.2, 1); }\n\n.fg-modal {\n  min-height: 62vh;\n  max-height: 100vh;\n  width: 100%;\n  z-index: 111; }\n  @media screen and (min-width: 768px) {\n    .fg-modal {\n      width: 62vw; } }\n  .fg-modal.ng-hide-remove {\n    -webkit-animation: 300ms zoomIn cubic-bezier(0, 0, 0.2, 1);\n       -moz-animation: 300ms zoomIn cubic-bezier(0, 0, 0.2, 1);\n         -o-animation: 300ms zoomIn cubic-bezier(0, 0, 0.2, 1);\n            animation: 300ms zoomIn cubic-bezier(0, 0, 0.2, 1); }\n  .fg-modal.ng-hide-add {\n    -webkit-animation: 300ms zoomOut cubic-bezier(0.4, 0, 1, 1);\n       -moz-animation: 300ms zoomOut cubic-bezier(0.4, 0, 1, 1);\n         -o-animation: 300ms zoomOut cubic-bezier(0.4, 0, 1, 1);\n            animation: 300ms zoomOut cubic-bezier(0.4, 0, 1, 1); }\n\n[ng\\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {\n  visibility: hidden !important; }\n\n.login-view {\n  height: 100vh;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n     -moz-box-orient: vertical;\n     -moz-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n  .login-view .login-form {\n    width: 62%; }\n  .login-view .login-input {\n    background-color: white;\n    color: rgba(0, 0, 0, 0.8);\n    border-radius: 2px;\n    border-width: 1px;\n    border-color: rgba(0, 0, 0, 0.12);\n    border-style: solid;\n    -webkit-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color, 200ms cubic-bezier(0.4, 0, 0.2, 1) -webkit-box-shadow;\n    transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color, 200ms cubic-bezier(0.4, 0, 0.2, 1) -webkit-box-shadow;\n    -o-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color;\n    -moz-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color;\n    transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color;\n    transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color, 200ms cubic-bezier(0.4, 0, 0.2, 1) -webkit-box-shadow;\n    padding: 5px 8px;\n    resize: none;\n    width: 100%;\n    margin-bottom: 10px; }\n    .login-view .login-input:focus {\n      outline: none;\n      border-color: #03A9F4;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(3, 169, 244, 0.4), 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n              box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(3, 169, 244, 0.4), 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n  .login-view .login-btn {\n    background-color: #8BC34A;\n    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n    display: -webkit-inline-box;\n    display: -webkit-inline-flex;\n    display: -moz-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    position: relative;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n       -moz-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    border-radius: 2px;\n    padding: 5px 10px;\n    -webkit-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -o-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -moz-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    color: white;\n    border: none;\n    width: 100%; }\n    .login-view .login-btn:hover {\n      background-color: #7db043;\n      cursor: pointer; }\n    .login-view .login-btn:active {\n      background-color: #84b946;\n      -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36);\n              box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36); }\n    .login-view .login-btn[disabled] {\n      pointer-events: none;\n      background-color: #a8d277;\n      opacity: 0.8; }\n  .login-view .signup-btn {\n    background-color: #2196F3;\n    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n    display: -webkit-inline-box;\n    display: -webkit-inline-flex;\n    display: -moz-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    position: relative;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n       -moz-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    border-radius: 2px;\n    padding: 5px 10px;\n    -webkit-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -o-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -moz-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    color: white;\n    margin-top: 10px;\n    width: 62%; }\n    .login-view .signup-btn:hover {\n      background-color: #1e87db;\n      cursor: pointer; }\n    .login-view .signup-btn:active {\n      background-color: #1f8fe7;\n      -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36);\n              box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36); }\n    .login-view .signup-btn[disabled] {\n      pointer-events: none;\n      background-color: #59b0f6;\n      opacity: 0.8; }\n\n.signup-view {\n  height: 100vh;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n     -moz-box-orient: vertical;\n     -moz-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n  .signup-view .signup-form {\n    width: 62%; }\n  .signup-view .signup-input {\n    background-color: white;\n    color: rgba(0, 0, 0, 0.8);\n    border-radius: 2px;\n    border-width: 1px;\n    border-color: rgba(0, 0, 0, 0.12);\n    border-style: solid;\n    -webkit-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color, 200ms cubic-bezier(0.4, 0, 0.2, 1) -webkit-box-shadow;\n    transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color, 200ms cubic-bezier(0.4, 0, 0.2, 1) -webkit-box-shadow;\n    -o-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color;\n    -moz-transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color;\n    transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color;\n    transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 200ms cubic-bezier(0.4, 0, 0.2, 1) border-color, 200ms cubic-bezier(0.4, 0, 0.2, 1) -webkit-box-shadow;\n    padding: 5px 8px;\n    resize: none;\n    width: 100%;\n    margin-bottom: 10px; }\n    .signup-view .signup-input:focus {\n      outline: none;\n      border-color: #03A9F4;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(3, 169, 244, 0.4), 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n              box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(3, 169, 244, 0.4), 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n  .signup-view .signup-btn {\n    background-color: #8BC34A;\n    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n    display: -webkit-inline-box;\n    display: -webkit-inline-flex;\n    display: -moz-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    position: relative;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n       -moz-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    border-radius: 2px;\n    padding: 5px 10px;\n    -webkit-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -o-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -moz-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    color: white;\n    border: none;\n    width: 100%; }\n    .signup-view .signup-btn:hover {\n      background-color: #7db043;\n      cursor: pointer; }\n    .signup-view .signup-btn:active {\n      background-color: #84b946;\n      -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36);\n              box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36); }\n    .signup-view .signup-btn[disabled] {\n      pointer-events: none;\n      background-color: #a8d277;\n      opacity: 0.8; }\n  .signup-view .back-btn {\n    background-color: #2196F3;\n    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n    display: -webkit-inline-box;\n    display: -webkit-inline-flex;\n    display: -moz-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    position: relative;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n       -moz-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    border-radius: 2px;\n    padding: 5px 10px;\n    -webkit-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -o-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    -moz-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);\n    color: white;\n    width: 62%;\n    margin-top: 10px; }\n    .signup-view .back-btn:hover {\n      background-color: #1e87db;\n      cursor: pointer; }\n    .signup-view .back-btn:active {\n      background-color: #1f8fe7;\n      -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36);\n              box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.24), inset 0 1px 2px rgba(0, 0, 0, 0.36); }\n    .signup-view .back-btn[disabled] {\n      pointer-events: none;\n      background-color: #59b0f6;\n      opacity: 0.8; }\n    .signup-view .back-btn i {\n      margin-right: 10px; }\n\n.navbar {\n  border-top: 1px solid rgba(0, 0, 0, 0.12);\n  height: 45px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 100;\n  background-color: white; }\n  .navbar .navbar-tab {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1;\n       -moz-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    color: #BDBDBD; }\n    .navbar .navbar-tab i {\n      font-size: 24px; }\n    .navbar .navbar-tab.is-active {\n      color: #8BC34A; }\n      .navbar .navbar-tab.is-active i {\n        font-size: 24px; }\n\n.fridge-view {\n  padding-top: 50px; }\n  .fridge-view .fridge-ctrl {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    height: 50px;\n    background-color: white;\n    padding: 0 15px;\n    position: fixed;\n    top: 0;\n    right: 0;\n    left: 0;\n    z-index: 100; }\n    .fridge-view .fridge-ctrl .ctrl-title {\n      font-size: 24px;\n      font-weight: 600;\n      color: #8BC34A;\n      margin-right: 15px; }\n    .fridge-view .fridge-ctrl .ctrl-spacer {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n         -moz-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1; }\n    .fridge-view .fridge-ctrl .ctrl-btn {\n      color: #BDBDBD; }\n      .fridge-view .fridge-ctrl .ctrl-btn i {\n        font-size: 24px; }\n  .fridge-view .fridge-item {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    background-color: white;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n    height: 60px; }\n    .fridge-view .fridge-item .item-icon {\n      -webkit-box-flex: 0;\n      -webkit-flex: 0 0 70px;\n         -moz-box-flex: 0;\n          -ms-flex: 0 0 70px;\n              flex: 0 0 70px;\n      height: 100%;\n      border-top: 10px solid transparent;\n      border-right: 15px solid transparent;\n      border-bottom: 10px solid transparent;\n      border-left: 15px solid transparent;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat; }\n    .fridge-view .fridge-item .item-details {\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -moz-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n         -moz-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: normal;\n      -webkit-flex-direction: column;\n         -moz-box-orient: vertical;\n         -moz-box-direction: normal;\n          -ms-flex-direction: column;\n              flex-direction: column;\n      padding: 10px 0;\n      -webkit-justify-content: space-around;\n          -ms-flex-pack: distribute;\n              justify-content: space-around; }\n    .fridge-view .fridge-item .item-name {\n      font-weight: 500; }\n    .fridge-view .fridge-item .item-expiry {\n      font-size: 11px; }\n      .fridge-view .fridge-item .item-expiry .label {\n        color: rgba(0, 0, 0, 0.5); }\n      .fridge-view .fridge-item .item-expiry .text {\n        color: #8BC34A; }\n    .fridge-view .fridge-item .item-quantity {\n      -webkit-box-flex: 0;\n      -webkit-flex: 0 0 60px;\n         -moz-box-flex: 0;\n          -ms-flex: 0 0 60px;\n              flex: 0 0 60px;\n      height: 100%;\n      font-size: 24px;\n      color: #8BC34A;\n      line-height: 60px;\n      padding: 0 15px;\n      text-align: right; }\n  .fridge-view .special-fridge-item {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    height: 200px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n    background-color: white !important;\n    background: url(src/assets/img/apple.png) right center no-repeat;\n    -webkit-background-size: 50% 50%;\n            background-size: 50%;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n       -moz-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n    -webkit-flex-direction: column;\n       -moz-box-orient: vertical;\n       -moz-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    padding-left: 15px; }\n    .fridge-view .special-fridge-item .name {\n      font-size: 30px; }\n      .fridge-view .special-fridge-item .name .mult i {\n        color: #690412;\n        font-size: 18px;\n        padding: 3px;\n        font-weight: 600; }\n      .fridge-view .special-fridge-item .name .quantity {\n        color: #8BC34A; }\n    .fridge-view .special-fridge-item .calorie {\n      margin-top: 10px; }\n      .fridge-view .special-fridge-item .calorie .value {\n        color: #8BC34A;\n        font-size: 18px; }\n      .fridge-view .special-fridge-item .calorie .unit {\n        color: rgba(0, 0, 0, 0.5); }\n\n.search-view {\n  padding-top: 50px;\n  position: relative; }\n  .search-view .search-ctrl {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    height: 50px;\n    background-color: white;\n    padding: 0 15px;\n    position: fixed;\n    top: 0;\n    right: 0;\n    left: 0;\n    z-index: 100; }\n    .search-view .search-ctrl .ctrl-title {\n      font-size: 24px;\n      font-weight: 600;\n      color: #8BC34A;\n      margin-right: 15px; }\n    .search-view .search-ctrl .ctrl-spacer {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n         -moz-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1; }\n    .search-view .search-ctrl .ctrl-btn {\n      color: #BDBDBD; }\n      .search-view .search-ctrl .ctrl-btn i {\n        font-size: 24px; }\n      .search-view .search-ctrl .ctrl-btn.ctrl-setting.is-active i {\n        color: #8BC34A; }\n  .search-view .search-form {\n    padding: 15px; }\n  .search-view .filter-row {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    padding: 0 15px;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    margin-bottom: 3px; }\n    .search-view .filter-row .label {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      font-size: 11px;\n      color: #8BC34A;\n      padding-right: 5px; }\n    .search-view .filter-row .filter-item {\n      height: 20px;\n      width: 30px;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat; }\n  .search-view .result-label {\n    font-family: \"Open Sans\", sans-serif;\n    letter-spacing: 2px;\n    word-spacing: 4px;\n    text-transform: uppercase;\n    font-weight: 600;\n    text-align: center;\n    margin: 10px 0 20px 0;\n    font-size: 11px;\n    color: rgba(0, 0, 0, 0.5); }\n  .search-view .search-results {\n    border-top: 1px solid rgba(0, 0, 0, 0.12); }\n    .search-view .search-results .result-item {\n      background-color: white;\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -moz-box;\n      display: -ms-flexbox;\n      display: flex;\n      border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n    .search-view .search-results .item-icon {\n      -webkit-box-flex: 0;\n      -webkit-flex: 0 0 70px;\n         -moz-box-flex: 0;\n          -ms-flex: 0 0 70px;\n              flex: 0 0 70px;\n      border-top: 10px solid transparent;\n      border-right: 15px solid transparent;\n      border-bottom: 10px solid transparent;\n      border-left: 15px solid transparent;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat; }\n    .search-view .search-results .item-details {\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -moz-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n         -moz-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: normal;\n      -webkit-flex-direction: column;\n         -moz-box-orient: vertical;\n         -moz-box-direction: normal;\n          -ms-flex-direction: column;\n              flex-direction: column;\n      padding: 10px 0;\n      -webkit-justify-content: space-around;\n          -ms-flex-pack: distribute;\n              justify-content: space-around; }\n    .search-view .search-results .item-name {\n      font-weight: 500;\n      line-height: 20px; }\n    .search-view .search-results .item-preptime {\n      -webkit-box-flex: 0;\n      -webkit-flex: 0 0 100px;\n         -moz-box-flex: 0;\n          -ms-flex: 0 0 100px;\n              flex: 0 0 100px;\n      height: 100%;\n      font-size: 24px;\n      color: #8BC34A;\n      line-height: 60px;\n      padding: 0 15px;\n      text-align: right; }\n      .search-view .search-results .item-preptime span {\n        color: #690412;\n        font-size: 14px;\n        padding-left: 2px; }\n  .search-view .settings {\n    position: absolute;\n    top: 50px;\n    right: 0;\n    left: 0;\n    min-height: 20px;\n    z-index: 80;\n    padding: 15px;\n    background-color: white;\n    min-height: -webkit-calc(100vh - 50px - 45px);\n    min-height: -moz-calc(100vh - 50px - 45px);\n    min-height: calc(100vh - 50px - 45px);\n    padding-bottom: 45px; }\n  .search-view .filter-group {\n    margin-bottom: 20px; }\n    .search-view .filter-group .group-label {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      margin-bottom: 10px;\n      font-size: 11px;\n      color: #8BC34A; }\n    .search-view .filter-group .allergens-container .allergen {\n      display: inline-block;\n      width: 45px;\n      height: 30px;\n      margin-bottom: 3px;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat;\n      opacity: 0.5; }\n      .search-view .filter-group .allergens-container .allergen:hover {\n        cursor: pointer;\n        opacity: 0.7; }\n      .search-view .filter-group .allergens-container .allergen.is-active {\n        opacity: 1; }\n    .search-view .filter-group .countries-container .country {\n      display: inline-block;\n      width: 45px;\n      height: 30px;\n      margin-bottom: 3px;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat;\n      opacity: 0.5; }\n      .search-view .filter-group .countries-container .country:hover {\n        cursor: pointer;\n        opacity: 0.7; }\n      .search-view .filter-group .countries-container .country.is-active {\n        opacity: 1; }\n  .search-view .separator {\n    width: 100%;\n    height: 1px;\n    padding-top: 10px;\n    margin-bottom: 30px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n  .search-view .list-container {\n    margin-bottom: 20px; }\n    .search-view .list-container .list-label {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      margin-bottom: 10px;\n      font-size: 11px;\n      color: #8BC34A; }\n    .search-view .list-container ul {\n      list-style: initial;\n      padding-left: 15px; }\n    .search-view .list-container li {\n      line-height: 20px; }\n\n.fg-suggest-search {\n  color: rgba(0, 0, 0, 0.8);\n  position: relative; }\n  .fg-suggest-search .search-group {\n    background-color: white;\n    width: 100%;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    padding: 5px 8px; }\n  .fg-suggest-search .search-input {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1;\n       -moz-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    border: none;\n    padding-right: 5px; }\n  .fg-suggest-search .search-btn i {\n    color: rgba(0, 0, 0, 0.5); }\n  .fg-suggest-search .suggestions-list {\n    position: absolute;\n    background-color: white;\n    top: 34px;\n    right: 0;\n    left: 0;\n    padding: 5px 0; }\n  .fg-suggest-search .suggestion-item {\n    padding: 5px 8px; }\n    .fg-suggest-search .suggestion-item:hover, .fg-suggest-search .suggestion-item.selected {\n      background-color: #8BC34A; }\n\n.recipe-detail-view {\n  padding-top: 50px;\n  position: relative; }\n  .recipe-detail-view .recipe-ctrl {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    height: 50px;\n    background-color: white;\n    padding: 0 15px;\n    position: fixed;\n    top: 0;\n    right: 0;\n    left: 0;\n    z-index: 100; }\n    .recipe-detail-view .recipe-ctrl .ctrl-title {\n      font-size: 24px;\n      font-weight: 600;\n      color: #8BC34A;\n      margin-right: 15px; }\n    .recipe-detail-view .recipe-ctrl .ctrl-spacer {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n         -moz-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1; }\n    .recipe-detail-view .recipe-ctrl .ctrl-btn {\n      color: #BDBDBD; }\n      .recipe-detail-view .recipe-ctrl .ctrl-btn i {\n        font-size: 24px; }\n      .recipe-detail-view .recipe-ctrl .ctrl-btn.ctrl-setting.is-active i {\n        color: #8BC34A; }\n  .recipe-detail-view .back-btn {\n    letter-spacing: 1px;\n    word-spacing: 2px;\n    text-transform: uppercase;\n    font-weight: 600;\n    font-size: 11px;\n    color: rgba(0, 0, 0, 0.5);\n    padding-bottom: 10px;\n    padding: 15px 15px 0 10px; }\n    .recipe-detail-view .back-btn i {\n      vertical-align: middle; }\n  .recipe-detail-view .recipe-name-heading {\n    font-family: \"Lato\", sans-serif;\n    font-size: 30px;\n    font-weight: 600;\n    color: rgba(0, 0, 0, 0.8);\n    padding: 15px;\n    margin-bottom: 10px; }\n  .recipe-detail-view .recipe-image {\n    margin: 0 auto 25px auto;\n    width: 150px;\n    height: 150px;\n    border-radius: 100%;\n    -webkit-background-size: cover;\n            background-size: cover;\n    background-position: center center;\n    background-repeat: no-repeat; }\n  .recipe-detail-view .recipe-section {\n    padding: 0 15px;\n    margin-bottom: 30px; }\n    .recipe-detail-view .recipe-section .text {\n      line-height: 20px;\n      padding: 0 5px; }\n    .recipe-detail-view .recipe-section .heading {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 1px;\n      word-spacing: 2px;\n      text-transform: uppercase;\n      font-weight: 600;\n      font-size: 14px;\n      color: #8BC34A;\n      padding-bottom: 10px;\n      border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n      margin-bottom: 10px; }\n      .recipe-detail-view .recipe-section .heading span {\n        color: rgba(0, 0, 0, 0.5); }\n  .recipe-detail-view .ingredient {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    line-height: 24px;\n    padding: 0 5px; }\n  .recipe-detail-view .ingredient-name {\n    -webkit-box-flex: 2;\n    -webkit-flex: 2;\n       -moz-box-flex: 2;\n        -ms-flex: 2;\n            flex: 2; }\n  .recipe-detail-view .ingredient-amount {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1;\n       -moz-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1; }\n\n.dashboard-view {\n  padding-top: 50px;\n  position: relative; }\n  .dashboard-view .dashboard-ctrl {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    height: 50px;\n    background-color: white;\n    padding: 0 15px;\n    position: fixed;\n    top: 0;\n    right: 0;\n    left: 0;\n    z-index: 100; }\n    .dashboard-view .dashboard-ctrl .ctrl-title {\n      font-size: 24px;\n      font-weight: 600;\n      color: #8BC34A;\n      margin-right: 15px; }\n    .dashboard-view .dashboard-ctrl .ctrl-spacer {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n         -moz-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1; }\n    .dashboard-view .dashboard-ctrl .ctrl-btn {\n      color: #BDBDBD; }\n      .dashboard-view .dashboard-ctrl .ctrl-btn i {\n        font-size: 24px; }\n      .dashboard-view .dashboard-ctrl .ctrl-btn.ctrl-setting.is-active i {\n        color: #8BC34A; }\n  .dashboard-view .notes {\n    margin: 15px;\n    padding: 15px;\n    border-radius: 2px;\n    border: 1px solid #8BC34A;\n    line-height: 1.4; }\n  .dashboard-view .settings {\n    position: absolute;\n    top: 50px;\n    right: 0;\n    left: 0;\n    min-height: 20px;\n    z-index: 80;\n    padding: 15px;\n    background-color: white;\n    min-height: -webkit-calc(100vh - 50px - 45px);\n    min-height: -moz-calc(100vh - 50px - 45px);\n    min-height: calc(100vh - 50px - 45px);\n    padding-bottom: 45px; }\n  .dashboard-view .filter-group {\n    margin-bottom: 20px; }\n    .dashboard-view .filter-group .group-label {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      margin-bottom: 10px;\n      font-size: 11px;\n      color: #8BC34A; }\n    .dashboard-view .filter-group .allergens-container .allergen {\n      display: inline-block;\n      width: 45px;\n      height: 30px;\n      margin-bottom: 3px;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat;\n      opacity: 0.5; }\n      .dashboard-view .filter-group .allergens-container .allergen:hover {\n        cursor: pointer;\n        opacity: 0.7; }\n      .dashboard-view .filter-group .allergens-container .allergen.is-active {\n        opacity: 1; }\n    .dashboard-view .filter-group .countries-container .country {\n      display: inline-block;\n      width: 45px;\n      height: 30px;\n      margin-bottom: 3px;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat;\n      opacity: 0.5; }\n      .dashboard-view .filter-group .countries-container .country:hover {\n        cursor: pointer;\n        opacity: 0.7; }\n      .dashboard-view .filter-group .countries-container .country.is-active {\n        opacity: 1; }\n  .dashboard-view .separator {\n    width: 100%;\n    height: 1px;\n    padding-top: 10px;\n    margin-bottom: 30px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n  .dashboard-view .list-container {\n    margin-bottom: 20px; }\n    .dashboard-view .list-container .list-label {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      margin-bottom: 10px;\n      font-size: 11px;\n      color: #8BC34A; }\n    .dashboard-view .list-container ul {\n      list-style: initial;\n      padding-left: 15px; }\n    .dashboard-view .list-container li {\n      line-height: 20px; }\n\n.plan-view {\n  padding-top: 50px;\n  position: relative; }\n  .plan-view .plan-ctrl {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n       -moz-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    height: 50px;\n    background-color: white;\n    padding: 0 15px;\n    position: fixed;\n    top: 0;\n    right: 0;\n    left: 0;\n    z-index: 100; }\n    .plan-view .plan-ctrl .ctrl-title {\n      font-size: 24px;\n      font-weight: 600;\n      color: #8BC34A;\n      margin-right: 15px; }\n    .plan-view .plan-ctrl .ctrl-spacer {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n         -moz-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1; }\n    .plan-view .plan-ctrl .ctrl-btn {\n      color: #BDBDBD; }\n      .plan-view .plan-ctrl .ctrl-btn i {\n        font-size: 24px; }\n      .plan-view .plan-ctrl .ctrl-btn.ctrl-setting.is-active i {\n        color: #8BC34A; }\n  .plan-view .settings {\n    position: absolute;\n    top: 50px;\n    right: 0;\n    left: 0;\n    min-height: 20px;\n    z-index: 80;\n    padding: 15px;\n    background-color: white;\n    min-height: -webkit-calc(100vh - 50px - 45px);\n    min-height: -moz-calc(100vh - 50px - 45px);\n    min-height: calc(100vh - 50px - 45px);\n    padding-bottom: 45px; }\n  .plan-view .filter-group {\n    margin-bottom: 20px; }\n    .plan-view .filter-group .group-label {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      margin-bottom: 10px;\n      font-size: 11px;\n      color: #8BC34A; }\n    .plan-view .filter-group .allergens-container .allergen {\n      display: inline-block;\n      width: 45px;\n      height: 30px;\n      margin-bottom: 3px;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat;\n      opacity: 0.5; }\n      .plan-view .filter-group .allergens-container .allergen:hover {\n        cursor: pointer;\n        opacity: 0.7; }\n      .plan-view .filter-group .allergens-container .allergen.is-active {\n        opacity: 1; }\n    .plan-view .filter-group .countries-container .country {\n      display: inline-block;\n      width: 45px;\n      height: 30px;\n      margin-bottom: 3px;\n      -webkit-background-size: contain;\n              background-size: contain;\n      background-position: center center;\n      background-repeat: no-repeat;\n      opacity: 0.5; }\n      .plan-view .filter-group .countries-container .country:hover {\n        cursor: pointer;\n        opacity: 0.7; }\n      .plan-view .filter-group .countries-container .country.is-active {\n        opacity: 1; }\n  .plan-view .separator {\n    width: 100%;\n    height: 1px;\n    padding-top: 10px;\n    margin-bottom: 30px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n  .plan-view .list-container {\n    margin-bottom: 20px; }\n    .plan-view .list-container .list-label {\n      font-family: \"Open Sans\", sans-serif;\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      margin-bottom: 10px;\n      font-size: 11px;\n      color: #8BC34A; }\n    .plan-view .list-container ul {\n      list-style: initial;\n      padding-left: 15px; }\n    .plan-view .list-container li {\n      line-height: 20px; }\n\nbody {\n  font-family: \"Roboto\", sans-serif;\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 14px;\n  padding-bottom: 45px;\n  background-color: #f7f7f7; }\n\n.under-construction {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n  .under-construction .card {\n    padding: 20px;\n    background-color: rgba(0, 0, 0, 0.7); }\n    .under-construction .card .icon i {\n      font-size: 24px;\n      color: white; }\n    .under-construction .card .text {\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      font-size: 11px;\n      padding-left: 10px;\n      color: white; }\n\n.under-construction-flat {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n  .under-construction-flat .card {\n    padding: 20px; }\n    .under-construction-flat .card .icon {\n      color: #888; }\n      .under-construction-flat .card .icon i {\n        font-size: 24px; }\n    .under-construction-flat .card .text {\n      letter-spacing: 2px;\n      word-spacing: 4px;\n      text-transform: uppercase;\n      font-weight: 600;\n      font-size: 11px;\n      padding-left: 10px;\n      color: #888; }\n\n.mobile-msg {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: rgba(0, 0, 0, 0.7);\n  z-index: 99999;\n  padding: 15%;\n  text-align: center;\n  line-height: 1.6;\n  color: white;\n  font-size: 18px; }\n  @media screen and (max-width: 767px) {\n    .mobile-msg {\n      display: none; } }\n"; });
define('text!not-found/not-found.html', ['module'], function(module) { module.exports = "<template>\n\tRoute not found.\n</template>"; });
define('text!plan/plan.html', ['module'], function(module) { module.exports = "<template>\n    <section class=\"plan-view\">\n        <div class=\"plan-ctrl\">\n            <div class=\"ctrl-title\">Plan</div>\n            <div class=\"ctrl-spacer\"></div>\n            <div class=\"ctrl-setting ctrl-btn ${displaySettings ? 'is-active' : ''}\" click.delegate=\"displaySettings = !displaySettings\"><i class=\"material-icons\">tune</i></div>\n        </div>\n    </section>\n</template>\n"; });
define('text!recipes/recipe-detail.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./recipe-detail\"></require>\n    <section class=\"recipe-detail-view\">\n        <div class=\"recipe-ctrl\">\n            <div class=\"ctrl-title\">Recipe</div>\n            <div class=\"ctrl-spacer\"></div>\n            <!-- <div class=\"ctrl-setting ctrl-btn ${displaySettings ? 'is-active' : ''}\" click.delegate=\"displaySettings = !displaySettings\"><i class=\"material-icons\">tune</i></div> -->\n        </div>\n        <div class=\"back-btn\" click.delegate=\"back()\"><i class=\"material-icons\">chevron_left</i>back</div>\n        <div class=\"recipe-name-heading\">${recipe.title}</div>\n        <div class=\"recipe-image\" css=\"background-image: url(${recipe.image})\"></div>\n        <div class=\"recipe-section ingredients\">\n            <div class=\"heading\">Ingredients <span>${recipe.extendedIngredients.length}</span></div>\n            <div class=\"ingredient\" repeat.for=\"ingredient of recipe.extendedIngredients\">\n                <div class=\"ingredient-name\">${ingredient.name}</div>\n                <div class=\"ingredient-amount\">${ingredient.amount} ${ingredient.unitShort}</div>\n            </div>\n        </div>\n        <div class=\"recipe-section directions\">\n            <div class=\"heading\">Directions</div>\n            <div class=\"text\">${recipe.instructions || 'none'}</div>\n        </div>\n    </section>\n</template>\n"; });
define('text!search/fg-elastic-search.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"fg-elastic-search\">\n        <div class=\"label\">${label}</div>\n        <div class=\"search-group\" css.bind=\"{paddingTop: searchGroupPaddingTop + 'px'}\">\n            <label class=\"search-icon\" for=\"search-input\"><i class=\"material-icons\">search</i></label>\n            <input class=\"search-input\" id=\"search-input\" type=\"search\" css.bind=\"{width: width + 'px'}\" value.bind=\"searchTerm\">\n            <div class=\"spacer\"></div>\n        </div>\n        <div class=\"search-width\" css.bind=\"{maxWidth: maxWidth}\">${searchTerm}</div>\n    </div>\n</template>\n"; });
define('text!search/search.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../shared/fg-suggest-search\"></require>\n    <section class=\"search-view\">\n        <div class=\"search-ctrl\">\n            <div class=\"ctrl-title\">Search</div>\n            <div class=\"ctrl-spacer\"></div>\n            <div class=\"ctrl-setting ctrl-btn ${displaySettings ? 'is-active' : ''}\" click.delegate=\"displaySettings = !displaySettings\"><i class=\"material-icons\">tune</i></div>\n        </div>\n        <form class=\"search-form\">\n            <fg-suggest-search></fg-suggest-search>\n        </form>\n        <div class=\"filter-row\" show.bind=\"filters.intolerances.length\">\n            <div class=\"label\">allergies:</div>\n            <div class=\"filter-item\" repeat.for=\"item of filters.intolerances\" css=\"background-image: url(${item.thumbnail})\"></div>\n        </div>\n        <div class=\"filter-row\" show.bind=\"filters.cuisine.length\">\n            <div class=\"label\">cuisine:</div>\n            <div class=\"filter-item\" repeat.for=\"item of filters.cuisine\" css=\"background-image: url(${item.thumbnail})\"></div>\n        </div>\n        <div show.bind=\"results.length\">\n            <div class=\"result-label\">found recipes</div>\n            <ul class=\"search-results\">\n                <li class=\"result-item\" repeat.for=\"item of results\" click.delegate=\"viewRecipe(item)\">\n                    <div class=\"item-icon\" css=\"background-image: url(${baseUri}${item.image})\"></div>\n                    <div class=\"item-details\">\n                        <div class=\"item-name\">${item.title}</div>\n                    </div>\n                    <div class=\"item-preptime\">\n                        ${item.readyInMinutes}<span>min</span>\n                    </div>\n                </li>\n            </ul>\n        </div>\n        <div class=\"settings\" show.bind=\"displaySettings\">\n            <div class=\"filter-group\">\n                <div class=\"group-label\">allergies</div>\n                <div class=\"allergens-container\">\n                    <div class=\"allergen ${allergen.active ? 'is-active' : ''}\" repeat.for=\"allergen of intolerances\" css=\"background-image: url(${allergen.thumbnail})\" click.delegate=\"toggleIntolerance(allergen)\"></div>\n                </div>\n            </div>\n            <div class=\"filter-group\">\n                <div class=\"group-label\">cuisine type</div>\n                <div class=\"countries-container\">\n                    <div class=\"country ${country.active ? 'is-active' : ''}\" repeat.for=\"country of countries\" css=\"background-image: url(${country.thumbnail})\" click.delegate=\"toggleCountry(country)\"></div>\n                </div>\n            </div>            \n            <div class=\"separator\"></div>\n            <div class=\"list-container\">\n                <div class=\"list-label\">todo</div>\n                <ul>\n                    <li>Add styling for tablets/monitors</li>\n                    <li>Add transition animations and visual cues</li>\n                    <li>Add cascade/unfold animations</li>\n                    <li>Use route-level resolve</li>\n                    <li>Move api keys out of client-side code and github</li>\n                    <li>Reorganize project with webpack</li>\n                    <li>Integrate OAuth 2</li>\n                    <li>Save preferences in db</li>\n                    <li>Persist session states</li>\n                </ul>\n            </div>\n            <div class=\"list-container\">\n                <div class=\"list-label\">issues</div>\n                <ul>\n                    <li>150ms debounce on search is too short for mobile. Enter key conflicts with debounce timing.</li>\n                    <li>Selecting more cuisine filters exclude more results.</li>\n                </ul>\n            </div>\n        </div>\n    </section>\n</template>\n"; });
define('text!settings/settings.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"under-construction-flat\">\n        <div class=\"card\">\n            <div class=\"icon\"><i class=\"mega-octicon octicon-tools\"></i></div>\n            <div class=\"text\">under construction</div>\n        </div>\n    </div>\n</template>"; });
define('text!shared/fg-suggest-search.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"fg-suggest-search\">\n        <div class=\"search-group\">\n            <input class=\"search-input\" id=\"search-input\" type=\"search\" value.bind=\"searchTerm & debounce:150\" keydown.delegate=\"inputHandler($event)\" focus.bind=\"searchFocus\" placeholder=\"${placeholder}\" autocomplete='off'>\n            <div class=\"search-btn\" click.delegate=\"searchRecipes()\"><i class=\"material-icons\">search</i></div>\n        </div>\n        <div class=\"suggestions-list\" show.bind=\"displaySuggestions\">\n        \t<div class=\"suggestion-item\" repeat.for=\"suggestion of suggestions\" class.bind=\"$index === selectedSuggestion ? 'selected' : ''\">${suggestion.title}</div>\n        </div>\n    </div>\n</template>\n"; });
define('text!shared/fg-tags-search.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"fg-suggest-search\">\n        <div class=\"search-group\">\n            <input class=\"search-input\" id=\"search-input\" type=\"search\" value.bind=\"searchTerm & debounce:150\" keydown.delegate=\"inputHandler($event)\" focus.bind=\"searchFocus\" placeholder=\"${placeholder}\" autocomplete='off'>\n            <div class=\"search-btn\" click.delegate=\"searchRecipes\"><i class=\"material-icons\">search</i></div>\n        </div>\n        <div class=\"suggestions-list\" show.bind=\"displaySuggestions\">\n        \t<div class=\"suggestion-item\" repeat.for=\"suggestion of suggestions\" class.bind=\"$index === selectedSuggestion ? 'selected' : ''\">${suggestion.title}</div>\n        </div>\n    </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map