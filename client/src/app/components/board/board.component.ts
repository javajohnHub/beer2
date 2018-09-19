import { Component } from '@angular/core';
import { SocketService } from '../../shared/socket.service';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html'
})
export class BoardComponent {
	socket: any;
	teams;
	constructor() {
		this.socket = SocketService.getInstance();
		this.socket.on('send teams', teams => {
			this.teams = teams;
		});
		this.socket.emit('get teams');
	}
}
