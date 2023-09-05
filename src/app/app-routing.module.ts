import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLogInComponent } from './auth-log-in/auth-log-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { AuthPasswordMailComponent } from './auth-password-mail/auth-password-mail.component';

const routes: Routes = [
  { path: '', component: AuthLogInComponent},
  { path: 'auth-signup', component: AuthSignUpComponent},
  { path: 'auth-password-mail', component: AuthPasswordMailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
