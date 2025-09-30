// auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { login } from '../state/auth.actions';
import {  NgIf } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  f = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

  submit() {
    if (this.f.invalid) return;
    this.store.dispatch(login({ email: this.f.value.email! }));
    this.router.navigateByUrl('/app');
  }
}
