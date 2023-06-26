import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  // selects with for to show -> false === login, true === register
  loadState = true;
  formStateSub!: Subscription;
  isLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.formStateSub = this.authService.loadingObs.subscribe((state: boolean) =>  {
      this.isLoading = state;
    });
    this.router.navigate(['login'], {relativeTo: this.route});
  }

  onSelectForm() {
    if (this.loadState) {
      this.loadState = !this.loadState;
      this.router.navigate(['register'], {relativeTo: this.route});
    } else {
      this.router.navigate(['login'], {relativeTo: this.route});
      this.loadState = !this.loadState;
    }

  }

  ngOnDestroy() {
    this.formStateSub.unsubscribe();
  }

}
