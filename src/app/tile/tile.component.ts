import { Component, HostListener, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
	selector: 'lmf-tile',
	templateUrl: './tile.component.html',
	styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnDestroy {
	private _neighbors: TileComponent[] = [];
	hasLandmine = false;
	isRevealed = false;
	hasFlag = false;
	text = '';

	tilesToReveal = new Subject<TileComponent[]>();

	constructor() {
		this.tilesToReveal
			.pipe(delay(50))
			.subscribe(tiles => {
				tiles.forEach(tile => {
					if (tile.isRevealed || tile.hasFlag) {
						return;
					}

					tile.revealTile();
					if (tile.text === '') {
						const nextBatchOfTiles = tile.getNeighbors().filter(x => !x.isRevealed && !x.hasFlag);
						this.tilesToReveal.next(nextBatchOfTiles);
					}
				});
			});
	}

	onClick: () => void;

	ngOnDestroy() {
		this._neighbors = null;
	}

	reset() {
		this.isRevealed = false;
		this.hasLandmine = false;
		this.hasFlag = false;
		this.text = '';
	}

	getNeighbors() {
		return this._neighbors;
	}

	@HostListener('click')
	click() {
		if (this.hasFlag) {
			return;
		}

		this.onClick();
		this.revealTile();

		if (this.text === '') {
			this.tilesToReveal.next(this._neighbors);
		}
	}

	@HostListener('contextmenu', ['$event'])
	flag(event) {
		event.preventDefault();

		if (this.hasFlag) {
			this.hasFlag = false;
			this.text = '';
		} else {
			this.hasFlag = true;
			this.text = '⚑';
		}
	}

	addNeighbor(tile: TileComponent) {
		if (tile == null) {
			throw new Error('Tile to add as neighbor cannot be null');
		}

		if (tile === this) {
			throw new Error('Tile cannot be a neighbor to itself');
		}

		if (this._neighbors.indexOf(tile) !== -1) {
			throw new Error('Provided tile is already a neighbor');
		}

		this._neighbors.push(tile);
	}

	revealTile() {
		this.isRevealed = true;
		if (this.hasLandmine) {
			this.text = '☼';
			return;
		}

		const neighborsWithLandmines
				= this._neighbors.filter(x => x.hasLandmine).length;

		if (neighborsWithLandmines > 0) {
			this.text = neighborsWithLandmines.toString();
			return;
		}

		this.text = '';
	}
}
