import { Component } from '@angular/core';
import { SocketService } from '../../shared/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html'
})
export class BoardComponent {
	socket: any;
	teams;
	team;
	beerForm: FormGroup;
	editForm: FormGroup;
	type = 'add';
	idx = 0;
	constructor(private _fb: FormBuilder) {}
	ngOnInit() {
		this.socket = SocketService.getInstance();
		this.socket.on('send teams', teams => {
			this.teams = teams;
		});

		this.socket.on('post team response', res => {
			this.teams.push(res);
			console.log('res', res);
		});

		this.socket.on('put team response', res => {
			this.teams.forEach((team, i) => {
				if ((team.name = res.name)) {
					this.teams.splice(i, 1, res);
				}
			});
		});

		this.socket.on('delete team response', res => {
			this.teams.forEach((team, i) => {
				if ((team.name = res.name)) {
					this.teams.splice(i, 1);
				}
			});
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
		this.type = 'add';
		let team = {
			name: [this.beerForm.get('name').value, [Validators.required]],
			p1: [this.beerForm.get('p1').value, [Validators.required]],
			p2: [this.beerForm.get('p2').value, [Validators.required]],
			score: 0
		};
		this.team = team;
		this.socket.emit('post team', team);
	}

	editTeam(team, i) {
		this.idx = i;
		this.team = team;
		this.editForm = this._fb.group({
			name: [team.name, [Validators.required]],
			p1: [team.p1, [Validators.required]],
			p2: [team.p2, [Validators.required]]
		});
		this.type = 'edit';
	}
	submit() {
		let team = {
			name: [this.editForm.get('name').value, [Validators.required]],
			p1: [this.editForm.get('p1').value, [Validators.required]],
			p2: [this.editForm.get('p2').value, [Validators.required]]
		};
		this.socket.emit('put team', team);
		this.type = 'add';
	}

	deleteTeam(team) {
		this.socket.emit('delete team', team);
	}
}
