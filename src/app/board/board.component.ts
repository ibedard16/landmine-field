import { Component, ComponentFactoryResolver, Renderer2, ElementRef, OnInit, ViewContainerRef, ViewChild } from '@angular/core';

import { TileComponent } from '../tile/tile.component';

@Component({
	selector: 'lmf-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
	@ViewChild('board') boardEl: ElementRef;
	board: TileComponent[][];

	boardWidth = 5;
	boardHeight = 5;

	constructor(
		private renderer: Renderer2,
		private componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef,
	) {
	}

	ngOnInit() {
		this.buildBoard();
	}

	private buildBoard() {
		this.board = [];
		for (let row = 0; row < this.boardHeight; row++) {
			this.board.push([]);

			for (let col = 0; col < this.boardWidth; col++) {
				const currentTile = this.buildTile(row, col);
				this.board[row].push(currentTile);
				currentTile.id = '' + row + ' ' + col;

				if (col > 0) {
					const leftTile = this.board[row][col - 1];
					currentTile.addNeighbor(leftTile);
					leftTile.addNeighbor(currentTile);
				}

				if (row > 0) {
					const upTile = this.board[row - 1][col];
					currentTile.addNeighbor(upTile);
					upTile.addNeighbor(currentTile);

					if (col > 0) {
						const upLeftTile = this.board[row - 1][col - 1];
						currentTile.addNeighbor(upLeftTile);
						upLeftTile.addNeighbor(currentTile);
					}

					if (col < this.boardWidth - 1) {
						const upRightTile = this.board[row - 1][col + 1];
						currentTile.addNeighbor(upRightTile);
						upRightTile.addNeighbor(currentTile);
					}
				}
			}
		}
	}

	private buildRow() {
		const row = this.renderer.createElement('div');
		this.renderer.appendChild(this.boardEl.nativeElement, row);
		return row;
	}

	private buildTile(row: number, col: number) {
		const tileFactory = this.componentFactoryResolver.resolveComponentFactory(TileComponent);
		const tile = this.viewContainerRef.createComponent(tileFactory);
		this.renderer.appendChild(this.boardEl.nativeElement, tile.location.nativeElement);
		this.renderer.setStyle(tile.location.nativeElement, 'grid-row', row + 1);
		this.renderer.setStyle(tile.location.nativeElement, 'grid-column', col + 1);
		return tile.instance;
	}
}
