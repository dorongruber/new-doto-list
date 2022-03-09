import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup, NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  authForm: FormGroup;
  error: string = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.InitForm();
  }

  InitForm() {

    const userName = '';
    const userEmail = '';
    const userPhone = '';
    const userPassword = '';
    const userConfiremPassword = '';

    this.authForm = new FormGroup({
      name: new FormControl(userName, [Validators.required]),
      email: new FormControl(userEmail, [
        Validators.required,
        Validators. email]),
      phone: new FormControl(userPhone, [ Validators.required]),
      passform: new FormGroup({
        password: new FormControl(userPassword, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
          Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})'))
        ]),
        confirmpassword: new FormControl(userConfiremPassword, [Validators.required])
      }, {validators: PassValidator})
    });
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      console.log('invalide form -> ', form);
    }
    this.isLoading = true;
    console.log('register form -> ', form);
    const name = form.value.name;
    const email = form.value.email;
    const phone = form.value.phone;
    const password = form.value.passform.password;

    let authObs: Observable<{message: boolean}>;

    authObs = this.authService.Register(name, phone, email, password);
    console.log('autb observable -> ', authObs);
    // add new user to db

    authObs.subscribe(resData => {
      if (resData) {
        this.isLoading = false;
        this.authService.loadingObs.next(this.isLoading);
        this.router.navigate(['../login'], {relativeTo: this.route});
      } else {
        this.isLoading = false;
        this.authService.loadingObs.next(this.isLoading);
      }
    });

    form.reset();

  }

}

export const PassValidator: ValidatorFn = (control:
  AbstractControl): ValidationErrors | null => {
    const pass = control.get('password');
    const confpass = control.get('confirmpassword');
    // console.log('custom validator -> ', pass, confpass);
    if (( pass.value  !== confpass.value) && pass && confpass) {
      return {NotEqualPasswords: true};
    }
    return null;
  };
