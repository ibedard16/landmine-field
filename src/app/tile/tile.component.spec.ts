import { TestBed, async } from '@angular/core/testing';
import { TileComponent } from './tile.component';
describe('TileComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TileComponent
			],
		}).compileComponents();
	}));

	it('should create the tile', async(() => {
		const fixture = TestBed.createComponent(TileComponent);
		const tile = fixture.debugElement.componentInstance;
		expect(tile).toBeTruthy();
	}));

	describe('addNeighbor', () => {
		it('should fail to add null as a neighbor', () => {
			const tile = TestBed.createComponent(TileComponent).componentInstance;

			expect(() => tile.addNeighbor(null)).toThrow(new Error('Tile to add as neighbor cannot be null'));
		});

		it('should fail to add itself as a neighbor', () => {
			const tile = TestBed.createComponent(TileComponent).componentInstance;

			expect(() => tile.addNeighbor(tile)).toThrow(new Error('Tile cannot be a neighbor to itself'));
		});

		it('should fail to add a tile that is already a neighbor', () => {
			const tile = TestBed.createComponent(TileComponent).componentInstance;
			const tileToAdd = TestBed.createComponent(TileComponent).componentInstance;
			tile.addNeighbor(tileToAdd);

			expect(() => tile.addNeighbor(tileToAdd)).toThrow(new Error('Provided tile is already a neighbor'));
		});
	});
});
