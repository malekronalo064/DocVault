import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let msalServiceSpy: jasmine.SpyObj<MsalService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Création d'un getter espion pour getActiveAccount()
    const getActiveAccountSpy = jasmine.createSpy('getActiveAccount');

    // Mock de MsalService avec un objet "instance" contenant le getter espion
    msalServiceSpy = jasmine.createSpyObj('MsalService', [], {
      instance: {
        getActiveAccount: getActiveAccountSpy
      }
    });

    // Mock du Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configuration du module de test
    TestBed.configureTestingModule({
      providers: [
        { provide: MsalService, useValue: msalServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow activation when user is authenticated', () => {
    // Simule un compte actif
    (msalServiceSpy.instance.getActiveAccount as jasmine.Spy).and.returnValue({ username: 'malek@example.com' });

    expect(guard.canActivate()).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation and redirect when user is not authenticated', () => {
    // Simule l'absence de compte actif
    (msalServiceSpy.instance.getActiveAccount as jasmine.Spy).and.returnValue(null);

    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
