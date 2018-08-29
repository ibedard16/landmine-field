import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { BoardComponent } from './board/board.component';

@Component({
	selector: 'lmf-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
	@ViewChild(BoardComponent) board: BoardComponent;

	width = 7;
	height = 7;
	landmineCount = 7;

	constructor(
		private cdf: ChangeDetectorRef
	) {

	}

	ngAfterViewInit() {
		this.board.buildBoard();
		this.board.placeLandmines();
		this.cdf.detectChanges();
	}

	applyChanges() {
		this.board.buildBoard();
		this.board.placeLandmines();
		this.cdf.detectChanges();
	}
}
