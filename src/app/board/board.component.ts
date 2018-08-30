import { Component, ComponentFactoryResolver, Renderer2, ElementRef, OnInit, ViewContainerRef, ViewChild, Input } from '@angular/core';

import { TileComponent } from '../tile/tile.component';

@Component({
	selector: 'lmf-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css']
})
export class BoardComponent {
	@ViewChild('board') boardEl: ElementRef;

	private board: TileComponent[][];

	private width: number;
	private height: number;
	private landmineCount: number;
	private landminesPlaced = false;

	constructor(
		private renderer: Renderer2,
		private componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef,
	) {
	}

	applySettings(width: number, height: number, landmineCount: number) {
		this.width = width;
		this.height = height;
		this.landmineCount = landmineCount;

		this.buildBoard();
	}

	reset() {
		const flatBoard = this.getFlatboard();
		flatBoard.forEach(x => x.reset());
		this.landminesPlaced = false;
	}

	private buildBoard() {
		this.viewContainerRef.clear();
		this.board = [];
		for (let row = 0; row < this.height; row++) {
			this.board.push([]);

			for (let col = 0; col < this.width; col++) {
				const currentTile = this.buildTile(row, col);
				this.board[row].push(currentTile);

				this.registerTileNeighbors(currentTile, row, col);
			}
		}
		this.landminesPlaced = false;
	}

	private placeLandmines(firstTileClicked: TileComponent) {
		if (this.landminesPlaced) {
			return;
		}
		this.landminesPlaced = true;

		const flatBoard = this.getFlatboard();

		flatBoard.splice(flatBoard.indexOf(firstTileClicked), 1);
		firstTileClicked.getNeighbors().forEach(neighbor => {
			flatBoard.splice(flatBoard.indexOf(neighbor), 1);
		});

		for (let i = 0; i < this.landmineCount; ++i) {
			const tile = this.getRandomTile(flatBoard);

			tile.hasLandmine = true;

			flatBoard.splice(flatBoard.indexOf(tile), 1);
		}
	}

	private buildTile(row: number, col: number) {
		const tileFactory = this.componentFactoryResolver.resolveComponentFactory(TileComponent);
		const tile = this.viewContainerRef.createComponent(tileFactory);
		this.renderer.appendChild(this.boardEl.nativeElement, tile.location.nativeElement);
		this.renderer.setStyle(tile.location.nativeElement, 'grid-row', row + 1);
		this.renderer.setStyle(tile.location.nativeElement, 'grid-column', col + 1);
		tile.instance.onClick = () => this.placeLandmines(tile.instance);
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

	private getFlatboard() {
		let flatBoard = [];
		this.board.forEach(row => {
			flatBoard = flatBoard.concat(row);
		});
		return flatBoard;
	}

	private getRandomTile(flatBoard: TileComponent[]) {
		const randomTile = Math.floor(Math.random() * flatBoard.length);
		return flatBoard[randomTile];
	}
}
