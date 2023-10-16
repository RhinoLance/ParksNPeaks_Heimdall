export class LatLng {
	public lat: number;
	public lng: number;

	public constructor(lat: number, lng: number) {
		this.lat = lat;
		this.lng = lng;
	}

	public static fromArray(arr: number[]): LatLng {
		return new LatLng(arr[0], arr[1]);
	}

	public toArray(): number[] {
		return [this.lat, this.lng];
	}
}
