import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class MozosService {

	constructor(public storage : Storage, private events: Events ){

	}
	
	isLoggedIn() {
		return new Promise((resolve, reject) => {
			resolve(true);
		}).catch((error)=> { console.log(error) })
	}

	getUser() {
		return this.storage.get('user').then((value) => {
	      	return value;
      })
	}

	login(){
		this.storage.set('logged-in', true);
		this.events.publish('user:login');
	}
}