import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

    this.authForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})'))
      ])
    });
  }
  onSubmit(form: NgForm) {
    // submit form
    console.log('auth form -> ', this.authForm);
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.Login(form.value.email, form.value.password);

    authObs.subscribe(resData => {
      // console.log('resData -> ', resData);

      this.error = null;
      this.router.navigate(['../../main'], { relativeTo: this.route});

      this.authService.loadingObs.next(this.isLoading);

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, errorMessage => {
      console.log(errorMessage);

      // console.log('error -> ', this.error);
      this.authService.loadingObs.next(this.isLoading);
      this.error = errorMessage;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    });
    form.reset();
  }

}
