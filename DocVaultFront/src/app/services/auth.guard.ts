import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private msalService: MsalService, private router: Router) {}

  canActivate(): boolean {
    const account = this.msalService.instance.getActiveAccount();
    if (account) {
      // L'utilisateur est authentifié
      return true;
    } else {
      // Redirection vers la page de connexion
      this.router.navigate(['/login']);
      return false;
    }
  }
}
