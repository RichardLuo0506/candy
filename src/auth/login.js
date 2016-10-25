import { Aurelia, inject } from 'aurelia-framework';
import { AuthService } from './auth-service';

@inject(Aurelia, AuthService)
export class Login {
	email = 'test@email.com';
	password = '123';
	error = '';

	constructor(aurelia, authService) {
		this.aurelia = aurelia;
		this.authService = authService;
	}

	login() {
		this.authService.login(this.email, this.password);
	}

	signup() {
		this.aurelia.setRoot('auth/signup');
	}
}
