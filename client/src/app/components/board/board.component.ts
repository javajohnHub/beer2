import { Component } from '@angular/core';
import { SocketService } from '../../shared/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/api';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html'
})
export class BoardComponent {
	socket: any;
	msgs: Message[] = [];
	teams;
	team;
	beerForm: FormGroup;
	editForm: FormGroup;
	roomForm: FormGroup;
	type = 'add';
	idx = 0;
	rooms;
	display: boolean = true;
	createRoomVis: boolean = false;
	constructor(
		private _fb: FormBuilder,
		private _confirmationService: ConfirmationService
	) {}
	ngOnInit() {
		this.socket = SocketService.getInstance();
		this.socket.on('send teams', teams => {
			this.teams = teams;
		});

		this.socket.on('send rooms', rooms => {
			console.log('rooms', this.rooms);
			this.rooms = rooms;
		});
		this.socket.on('some event', () => {
			console.log('joined room');
		});
		this.socket.on('post team response', res => {
			console.log(res);
			this.teams.push(res);
			console.log('post response', res);
		});

		this.socket.on('put team response', res => {
			this.teams.forEach((team, i) => {
				console.log(team, res);
				if (team.name == res.name) {
					this.teams.splice(i, 1, res);
				}
			});
		});

		this.socket.on('delete team response', res => {
			this.teams.forEach((team, i) => {
				if (team.name == res.name) {
					this.teams.splice(i, 1);
				}
			});
		});
		this._createForm();
		this.socket.emit('get teams');

		this._confirmationService.confirm({
			message: 'Join Room or Create New Room?',
			header: 'Confirmation',
			icon: 'pi pi-question',
			accept: () => {
				this.roomForm = this._fb.group({
					name: ['', [Validators.required]]
				});
				this.createRoomVis = true;
			},
			reject: () => {}
		});
	}

	private _createForm() {
		this.beerForm = this._fb.group({
			name: ['', [Validators.required]],
			p1: ['', [Validators.required]],
			p2: ['', [Validators.required]]
		});
	}
	addTeam() {
		this.type = 'add';
		let team = {
			name: this.beerForm.get('name').value,
			p1: this.beerForm.get('p1').value,
			p2: this.beerForm.get('p2').value,
			score: 0
		};
		this.team = team;
		console.log('add', team);
		this.socket.emit('post team', team);
		this.beerForm.reset();
	}

	editTeam(team, i) {
		this.idx = i;
		this.team = team;
		console.log('edit', team);
		this.editForm = this._fb.group({
			name: [team.name, [Validators.required]],
			p1: [team.p1, [Validators.required]],
			p2: [team.p2, [Validators.required]]
		});
		this.type = 'edit';
	}
	submit(team) {
		this.team = team;
		this.socket.emit('put team', team);
		this.type = 'add';
		this.editForm.reset();
	}

	deleteTeam(team) {
		this.socket.emit('delete team', team);
		this.type = 'add';
	}

	minus(team) {
		this.team = team;
		console.log(team.score);
		if (this.type == 'edit' && team.score > 0) {
			team.score--;
			console.log(team.score);
			this.socket.emit('put team', team);
		}
		console.log(this.team.score);
	}

	plus(team) {
		if (this.type == 'edit') {
			team.score++;
			this.socket.emit('put team', team);
		}
	}

	joinRoom(room) {
		console.log();
	}

	addRoom() {
		this.createRoomVis = false;
		this.socket.emit('add room', this.roomForm.get('name').value);
	}
}
