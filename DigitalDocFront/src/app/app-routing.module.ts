import { BadRequestComponent } from './error-pages/bad-request/bad-request.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FileUploadFormComponent } from './file-upload-form/file-upload-form.component';
import { MsalGuard } from '@azure/msal-angular';
import { DoclisteComponent } from './docliste/docliste.component';

const routes: Routes = [
  {path : '', redirectTo : '/login', pathMatch : 'full'},
  { path: 'login', component: LoginComponent },//canActivate: [MsalGuard]
  { path: 'pageErreur', component: BadRequestComponent },
  { path: 'depotDoc', component: FileUploadFormComponent, canActivate: [MsalGuard] },
  { path: 'listDoc', component: DoclisteComponent, canActivate: [MsalGuard] },
  // redirige vers la page d'erreur si l'URL ne correspond à aucune route
  { path: '**', redirectTo: '/pageErreur'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
