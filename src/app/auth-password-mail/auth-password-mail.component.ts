import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailValidator } from '../shared/validators/custom-validators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-password-mail',
  templateUrl: './auth-password-mail.component.html',
  styleUrls: ['./auth-password-mail.component.scss']
})
export class AuthPasswordMailComponent implements OnInit {

  passwordMailForm = new FormGroup({
    passwordMailEmail: new FormControl('', [Validators.required, emailValidator])
  });

  @ViewChild('authSuccess', { static: false }) authSuccess: ElementRef;

  constructor
    (
      private authService: AuthService,
      private router: Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.passwordMailForm.valid) {
      const email = this.passwordMailForm.value.passwordMailEmail;
      this.authService.sendPasswordResetEmail(email)
        .then(() => {
          this.authSuccessAnimation();
          setTimeout(() => {
            this.router.navigate(['/auth-confirm-new-password']);
          }, 1600);
        })
        .catch((error) => {
        });
    }
  }

  authSuccessAnimation() {
    this.authSuccess.nativeElement.classList.add('is__active');
    setTimeout(() => {
      this.authSuccess.nativeElement.style.display = "none";
    }, 1450);
  }
}
