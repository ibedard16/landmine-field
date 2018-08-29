import { Component, ComponentFactoryResolver, Renderer2, ElementRef, OnInit, ViewContainerRef, ViewChild, Input } from '@angular/core';

import { TileComponent } from '../tile/tile.component';

@Component({
	selector: 'lmf-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css']
})
export class BoardComponent {
	@ViewChild('board') boardEl: ElementRef;

	@Input() width: number;
	@Input() height: number;
	@Input() landmineCount: number;

	board: TileComponent[][];

	constructor(
		private renderer: Renderer2,
		private componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef,
	) {
	}

	buildBoard() {
		// this.viewContainerRef.clear();
		this.board = [];
		for (let row = 0; row < this.height; row++) {
			this.board.push([]);

			for (let col = 0; col < this.width; col++) {
				const currentTile = this.buildTile(row, col);
				this.board[row].push(currentTile);

				this.registerTileNeighbors(currentTile, row, col);
			}
		}
	}

	placeLandmines() {
		for (let i = 0; i < this.landmineCount; ++i) {
			let tile = this.getRandomTile();
			while (tile.hasLandmine) {
				tile = this.getRandomTile();
			}

			tile.hasLandmine = true;
		}
	}

	private buildTile(row: number, col: number) {
		const tileFactory = this.componentFactoryResolver.resolveComponentFactory(TileComponent);
		const tile = this.viewContainerRef.createComponent(tileFactory);
		this.renderer.appendChild(this.boardEl.nativeElement, tile.location.nativeElement);
		this.renderer.setStyle(tile.location.nativeElement, 'grid-row', row + 1);
		this.renderer.setStyle(tile.location.nativeElement, 'grid-column', col + 1);
		return tile.instance;
	}

	private registerTileNeighbors(tile: TileComponent, row: number, col: number) {
		if (col > 0) {
			const leftTile = this.board[row][col - 1];
			tile.addNeighbor(leftTile);
			leftTile.addNeighbor(tile);
		}

		if (row > 0) {
			const upTile = this.board[row - 1][col];
			tile.addNeighbor(upTile);
			upTile.addNeighbor(tile);

			if (col > 0) {
				const upLeftTile = this.board[row - 1][col - 1];
				tile.addNeighbor(upLeftTile);
				upLeftTile.addNeighbor(tile);
			}

			if (col < this.width - 1) {
				const upRightTile = this.board[row - 1][col + 1];
				tile.addNeighbor(upRightTile);
				upRightTile.addNeighbor(tile);
			}
		}
	}

	private getRandomTile() {
		const randomRow = Math.floor((Math.random() * this.height));
		const randomCol = Math.floor((Math.random() * this.width));

		return this.board[randomRow][randomCol];
	}
}
