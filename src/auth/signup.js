import { Aurelia, inject } from 'aurelia-framework';
import { AuthService } from './auth-service';

@inject(Aurelia, AuthService)
export class Signup {
	email = '';
	password = '';
	passwordConfirm = '';
	error = '';

	constructor(aurelia, authService) {
		this.aurelia = aurelia;
		this.authService = authService;
	}

	backToLogin() {
		this.aurelia.setRoot('auth/login');
	}

	signup() {
		if (this.email && this.password && this.password === this.passwordConfirm) {
			this.authService.signup(this.email, this.password)
				.then(res => {
					if (res.status === 'success') {
						console.log('success', res);
					} else {
						console.log('error', res.message);
					}
				});;
		}
	}
}
