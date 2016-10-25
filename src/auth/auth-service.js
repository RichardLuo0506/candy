import { Aurelia, inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
// import bcrypt from 'bcryptjs';

@inject(Aurelia, HttpClient)
export class AuthService {
	constructor(Aurelia, HttpClient) {
		this.aurelia = Aurelia;
		this.httpClient = HttpClient;
		this.httpClient.configure(config => {
			config
				.useStandardConfiguration()
				.withBaseUrl('//localhost:8080/');
		});
		this.session = localStorage.authToken || null;
	}

	isAuthed() {
		return this.session !== null;
	}

	login(email, password) {
		return this.httpClient.fetch('login', {
				method: 'post',
				body: json({ email, password })
			})
			.then(res => res.json())
			.then(authToken => {
				console.log('', authToken);
				localStorage.authToken = authToken;
				this.session = authToken;
				this.aurelia.setRoot('app');
			});
	}

	signup(email, password) {
		let user = { email: email, password: password };
		return this.httpClient.fetch('createUser', {
			method: 'post',
			body: json(user)
		}).then(res => res.json());
	}
}
