import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject, firstValueFrom } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'DocVaultFront';
  loginDisplay = false;
  tokenExpiration: string = '';
  private readonly _destroying$ = new Subject<void>();
  token: string = '';
  apiResponse: any;
  errorMsg: string = '';

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS)
      )
      .subscribe(msg => {
        this.tokenExpiration = (msg.payload as any).expiresOn;
        localStorage.setItem('tokenExpiration', this.tokenExpiration);
      });
    if (this.isUserLoggedIn()) {
      console.log("connecté avec succès");
    } else {
      this.router.navigate(['login']);
    }
  }

  setLoginDisplay(): void {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAccount(): void {
    const account = this.authService.instance.getActiveAccount();
    if (account) {
      console.log('User is already logged in:', account);
      this.acquireToken();
    } else {
      console.log('No user is logged in.');
    }
  }

  isUserLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() !== null; // Vérifie si l'utilisateur est connecté
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  async acquireToken(): Promise<void> {
    const request = { scopes: ["openid", "profile", "api://edb9da63-5568-40fe-a51c-2ca90992eb18/Doc.Read"] };
    try {
      const tokenResponse = await firstValueFrom(this.authService.acquireTokenSilent(request));
      this.token = tokenResponse.accessToken;
      console.log('Token acquired:', this.token);
      this.router.navigate(['depotDoc']);
    } catch (error) {
      console.error('Error acquiring token silently. Trying popup...', error);
      try {
        const tokenResponse = await firstValueFrom(this.authService.acquireTokenPopup(request));
        this.token = tokenResponse.accessToken;
        console.log('Token acquired via popup:', this.token);
        this.router.navigate(['depotDoc']);
      } catch (popupError) {
        console.error('Error acquiring token via popup:', popupError);
      }
    }
  }

  async callApi(): Promise<void> {
    if (!this.token) {
      this.errorMsg = 'Veuillez vous connecter avant d\'accéder à DocVault.';
      console.error('No token available. Please login first.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    try {
      this.apiResponse = await firstValueFrom(
        this.http.get('https://localhost:7001/api/protected-controller/protected-endpoint', { headers })
      );
      console.log('API Response:', this.apiResponse);
    } catch (error) {
      console.error('API call failed:', error);
      const err = error as any;
      if (err.status === 401 || err.status === 403) {
        this.errorMsg = 'Accès refusé. Veuillez vérifier votre authentification.';
      } else {
        this.errorMsg = 'Une erreur est survenue lors de l\'appel à l\'API. Veuillez réessayer plus tard.';
      }
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
