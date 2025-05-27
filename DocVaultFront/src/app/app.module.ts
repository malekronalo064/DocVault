import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BadRequestComponent } from './error-pages/bad-request/bad-request.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component'; // Ajoutez cette ligne
import { DoclisteComponent } from './docliste/docliste.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule } from '@angular/forms';  // Import nécessaire


import { FileUploadFormComponent } from './file-upload-form/file-upload-form.component';

import { MsalModule, MsalService, MSAL_INSTANCE, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
// MSAL Instance Factory
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'ea10389f-db73-4675-9fa0-99b48492aacf', // Your Azure AD app's client ID
      authority: 'https://login.microsoftonline.com/8b7e87f9-bdda-4d49-be09-936c299c984c', // Your tenant ID
      redirectUri: 'http://localhost:4200', // Update to match your desired redirect URI
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true // Recommended for IE11 and Edge
    }
  });
}

// MSAL Interceptor Configuration
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['Doc.read']);
  // Add other protected resources and their scopes as needed
  return {
    interactionType: InteractionType.Redirect, // Change this to Popup if needed
    protectedResourceMap
  };
}

// MSAL Guard Configuration
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect, // Can be changed to Popup
    authRequest: {
      //scopes: ['user.read'], // Add additional scopes if needed
      //scopes: ["user.Read", "openid", "profile"],
      scopes: ["api://ea10389f-db73-4675-9fa0-99b48492aacf/Doc.Read"]// You can ask for different permissions here
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BadRequestComponent,
    SideMenuComponent,
    HeaderMenuComponent,
    FileUploadFormComponent,
    DoclisteComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MsalModule.forRoot(
      MSALInstanceFactory(), // Instance factory for MSAL
      MSALGuardConfigFactory(), // Guard configuration factory
      MSALInterceptorConfigFactory() // Interceptor configuration factory
    ),
    MsalModule,
    FormsModule,
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
