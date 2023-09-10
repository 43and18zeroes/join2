import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-confirm-new-password',
  templateUrl: './auth-confirm-new-password.component.html',
  styleUrls: ['./auth-confirm-new-password.component.scss']
})
export class AuthConfirmNewPasswordComponent implements OnInit {

  confirmNewPasswordForm = new FormGroup({
    confirmNewPasswordPassword0: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmNewPasswordPassword1: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  @ViewChild('authSuccess', { static: false }) authSuccess: ElementRef;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authSuccessAnimation();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1600);
  }

  authSuccessAnimation() {
    this.authSuccess.nativeElement.classList.add('is__active');
    setTimeout(() => {
      this.authSuccess.nativeElement.style.display = "none";
    }, 1450);
  }
}
