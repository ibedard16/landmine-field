import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'lmf-tile',
	templateUrl: './tile.component.html',
	styleUrls: ['./tile.component.css']
})
export class TileComponent {
	private _neighbors: TileComponent[] = [];
	id: string;
	text = '';

	@HostListener('click')
	click() {
		this.text = 'clicked';
		this._neighbors.forEach(x => x.touch(this.id));
	}

	touch(id: string) {
		this.text = 'touched by ' + id;
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
}
