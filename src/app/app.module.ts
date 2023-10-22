import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLogInComponent } from './auth-log-in/auth-log-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { AuthPasswordMailComponent } from './auth-password-mail/auth-password-mail.component';
import { AuthConfirmNewPasswordComponent } from './auth-confirm-new-password/auth-confirm-new-password.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { MainComponent } from './main/main.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SharedModule } from './shared/shared.module';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainSummaryComponent } from './main-summary/main-summary.component';
import { MainAddTaskComponent } from './main-add-task/main-add-task.component';
import { MainBoardComponent } from './main-board/main-board.component';
import { MainContactsComponent } from './main-contacts/main-contacts.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MainDialogAddContactComponent } from './main-dialog-add-contact/main-dialog-add-contact.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MainDialogEditContactComponent } from './main-dialog-edit-contact/main-dialog-edit-contact.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthLogInComponent,
    AuthSignUpComponent,
    AuthPasswordMailComponent,
    AuthConfirmNewPasswordComponent,
    MainComponent,
    MainHeaderComponent,
    MainSummaryComponent,
    MainAddTaskComponent,
    MainBoardComponent,
    MainContactsComponent,
    MainDialogAddContactComponent,
    MainDialogEditContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    SharedModule,
    MatDialogModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
