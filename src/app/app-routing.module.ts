import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLogInComponent } from './auth-log-in/auth-log-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { AuthPasswordMailComponent } from './auth-password-mail/auth-password-mail.component';
import { AuthConfirmNewPasswordComponent } from './auth-confirm-new-password/auth-confirm-new-password.component';
import { MainComponent } from './main/main.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: AuthLogInComponent},
  { path: 'auth-signup', component: AuthSignUpComponent},
  { path: 'auth-password-mail', component: AuthPasswordMailComponent},
  { path: 'auth-confirm-new-password', component: AuthConfirmNewPasswordComponent},
  { path: 'main', component: MainComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
