import { Component, HostListener, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'lmf-tile',
	templateUrl: './tile.component.html',
	styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnDestroy {
	private _neighbors: TileComponent[] = [];
	hasLandmine = false;
	isRevealed = false;
	text = '';

	ngOnDestroy() {
		this._neighbors = null;
	}

	@HostListener('click')
	click() {
		this.revealTile().subscribe();
	}

	touch() {
		if (this.hasLandmine) {
			throw new Error('Tile with landmine should never be touched');
		}

		return this.revealTile();
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

	private revealTile() {
		return new Observable(() => {
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
			this.touchNeighbors();
		});
	}

	private touchNeighbors() {
		this._neighbors
			.filter(x => !x.isRevealed)
			.forEach(x => x.touch().subscribe());
	}
}
