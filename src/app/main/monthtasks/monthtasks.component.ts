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

    this.monthTasksList = this.taskService.GetTasks();
    this.montSubscription = this.taskService.mounthTAsksChanged
      .subscribe(tasks => {
        this.isLoading = true;
        // console.log('new color task -> ', tasks);
        this.monthTasksList = [];
        this.monthTasksList.push(...tasks);
        // console.log('this.monthTasksList subscribe -> ', this.monthTasksList);
        this.isLoading = false;
    });

  }

  onLogout() {
    this.authService.Logout();
  }

  ngOnDestroy() {
    this.montSubscription.unsubscribe();
  }

}
