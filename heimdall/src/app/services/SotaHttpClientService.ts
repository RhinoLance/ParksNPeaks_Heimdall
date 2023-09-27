import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { authConfig } from "../utilities/sota.sso.config";

@Injectable({
	providedIn: "root",
})
export class SotaHttpClientService {
	public constructor(private _oAuthSvc: OAuthService) {
		this.configureSingleSignOn();
	}

	public login(): void {
		this._oAuthSvc.initLoginFlow();
	}

	public logout(): void {
		this._oAuthSvc.logOut();
	}

	private configureSingleSignOn(): void {
		this._oAuthSvc.configure(authConfig);
		//this._oAuthSvc.tokenValidationHandler = new JwksValidationHandler();
		//this._oAuthSvc.loadDiscoveryDocumentAndTryLogin();
		this._oAuthSvc.loadDiscoveryDocumentAndLogin();
	}
}
