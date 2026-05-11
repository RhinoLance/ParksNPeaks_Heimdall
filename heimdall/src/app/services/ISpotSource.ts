import { Observable } from "rxjs";
import { Spot } from "../models/Spot";
import { CancellationToken } from "../models/CancellationToken";

export interface ISpotSource {
	subscribeToSpots(
		updateInterval?: number,
		cancellationToken?: CancellationToken
	): Observable<Spot>;
}
