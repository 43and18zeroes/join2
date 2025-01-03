import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLogInComponent } from './auth-log-in/auth-log-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { AuthPasswordMailComponent } from './auth-password-mail/auth-password-mail.component';
import { AuthConfirmNewPasswordComponent } from './auth-confirm-new-password/auth-confirm-new-password.component';
import { MainComponent } from './main/main.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLogInComponent,
    canActivate: [authGuard], // Schutz für den Login-Bereich
  },
  {
    path: 'auth-signup',
    component: AuthSignUpComponent,
    canActivate: [authGuard], // Schutz für die Registrierung
  },
  {
    path: 'auth-password-mail',
    component: AuthPasswordMailComponent,
    canActivate: [authGuard], // Schutz für Passwort-Mail
  },
  {
    path: 'auth-confirm-new-password',
    component: AuthConfirmNewPasswordComponent,
    canActivate: [authGuard], // Schutz für Passwort-Bestätigung
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard], // Schutz für Main
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
