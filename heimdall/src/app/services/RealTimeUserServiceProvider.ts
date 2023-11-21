import { environment } from "src/environments/environment";
import { RealTimeUserService } from "./RealTimeUserService";
import { RealTimeUserServiceMock } from "./RealTimeUserServiceMock";
import { RealTimeUserServiceSignalR } from "./RealTimeUserServiceSignalR";
import { EnvironmentName } from "src/environments/TEnvironment";

export const provideRealTimeUserService = () => {
	return {
		provide: RealTimeUserService,
		useFactory: realTimeUserServiceFactory,
		deps: [RealTimeUserServiceSignalR, RealTimeUserServiceMock],
	};
};

function realTimeUserServiceFactory(
	userSvcSigR: RealTimeUserServiceSignalR,
	userSvcMock: RealTimeUserServiceMock
): RealTimeUserService {
	switch (environment.name) {
		case EnvironmentName.Prod:
			return userSvcSigR;

		default:
			return userSvcMock;
	}
}
