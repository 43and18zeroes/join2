import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLogInComponent } from './auth-log-in/auth-log-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';

const routes: Routes = [
  { path: '', component: AuthLogInComponent},
  { path: 'signup', component: AuthSignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
