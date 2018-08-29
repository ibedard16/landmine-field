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
	error = '';

	constructor(
		private cdf: ChangeDetectorRef
	) {

	}

	ngAfterViewInit() {
		this.board.buildBoard();
		this.cdf.detectChanges();
	}

	applyChanges() {
		const numberOfTiles = this.width * this.height;
		if (numberOfTiles > 5000) {
			this.error = 'Requested board was too big to generate.';
			return;
		}

		if (this.landmineCount > numberOfTiles / 2) {
			this.error = 'There are too many landmines to place on this size grid';
			return;
		}

		this.error = '';

		this.board.buildBoard();
		this.cdf.detectChanges();
	}
}
