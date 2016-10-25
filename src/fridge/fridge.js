export class fridge {
	constructor() {
		// move init properties into route resolve
		this.fridge = this.getFridgeItems();
	}

	getFridgeItems() {
		return [
			{ name: 'Banana', quantity: 3, expiration: '5 days', thumbnail: 'src/assets/img/banana.png' },
			{ name: 'Potato', quantity: 4, expiration: '12 days', thumbnail: 'src/assets/img/potato.png' },
			{ name: 'Egg', quantity: 12, expiration: '17 days', thumbnail: 'src/assets/img/egg.png' },
			{ name: 'Dr Pepper', quantity: 6, expiration: 'Never', thumbnail: 'src/assets/img/drpepper.png' }
		];
	}
}
