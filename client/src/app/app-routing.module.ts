import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
	{
		path: '',
		component: BoardComponent
	}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: []
})
export class FrontRoutingModule {}
