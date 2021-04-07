import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-monthtasks',
  templateUrl: './monthtasks.component.html',
  styleUrls: ['./monthtasks.component.css']
})
export class MonthtasksComponent implements OnInit, OnDestroy {
  isLoading = false;

  monthTasksList: Task[] = [];
  montSubscription: Subscription;
  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.montSubscription = this.taskService.mounthTAsksChanged
      .subscribe(tasks => {
        this.monthTasksList = [];
        this.monthTasksList.push(...tasks);
        this.isLoading = false;
    });
    this.monthTasksList = this.taskService.GetTasks();
    if ( this.monthTasksList.length > 0 ) {
      this.isLoading = false;
    }
    // console.log('this.monthTasksList subscribe -> ', this.monthTasksList);
  }

  onLogout() {
    this.authService.Logout();
  }

  ngOnDestroy() {
    this.montSubscription.unsubscribe();
  }

}
