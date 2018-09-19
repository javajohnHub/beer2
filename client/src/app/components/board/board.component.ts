import { Component } from '@angular/core';
import { SocketService } from '../../shared/socket.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html'
})
export class BoardComponent {
	socket: any;
	teams;
	beerForm: FormGroup;
	res;
	constructor(private _fb: FormBuilder) {}
	ngOnInit() {
		this.socket = SocketService.getInstance();
		this.socket.on('send teams', teams => {
			this.teams = teams;
		});

		this.socket.on('post team response', res => {
			this.res = res;
			console.log('res', res);
		});
		this._createForm();
		this.socket.emit('get teams');
	}

	private _createForm() {
		this.beerForm = this._fb.group({
			name: [''],
			p1: [''],
			p2: [''],
			score: [0]
		});
	}
	addTeam() {
		let team = {
			name: this.beerForm.get('name').value,
			p1: this.beerForm.get('p1').value,
			p2: this.beerForm.get('p2').value,
			score: 0
		};
		console.log(team);
		this.socket.emit('post team', team);
	}
}
