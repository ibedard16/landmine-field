import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { TileComponent } from './tile/tile.component';

@NgModule({
	declarations: [
		AppComponent,
		BoardComponent,
		TileComponent
	],
	imports: [
		BrowserModule
	],
	entryComponents: [
		TileComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
