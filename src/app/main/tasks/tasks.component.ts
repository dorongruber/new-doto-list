import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService } from '../calendar.service';
import { Day } from '../day.model';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  toDaysTasks: Task[] = [];
  listSubscription: Subscription;
  // cd: Day;
  // dateSubscription: Subscription;
  // monthsList: {m: string, nd: number}[] = [];
  constructor(
    private taskService: TaskService,
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.monthsList = this.calendarService.getMonthList();
    // this.cd = this.calendarService.getCurrentDate();
    // console.log('current date -> ', this.cd);
    // this.dateSubscription = this.calendarService.changedDate
    // .subscribe(date => {
    //   this.cd = {
    //     d: date.d,
    //     m: date.m,
    //     y: date.y
    //   };
    // });
    this.toDaysTasks = this.taskService.GetToDaysTasks();
    this.listSubscription = this.taskService.dayTAsksChanged.subscribe(tasks => {
      this.toDaysTasks = [];
      this.toDaysTasks.push(...tasks);
    });
    console.log('this.toDaysTasks -> ', this.toDaysTasks);
    // this.router.navigate(['./task-list'], {relativeTo: this.route});
  }

  // Perv() {
  //   let newday = (this.cd.d - 1) % this.monthsList[this.cd.m].nd;
  //   if (newday !== -1) {
  //     // this.m = newmount;
  //     this.calendarService.setCurrentDate(newday, this.cd.m, this.cd.y);
  //   } else {
  //     newday = this.monthsList[this.cd.m].nd;
  //     this.calendarService.setCurrentDate(newday, this.cd.m, this.cd.y );
  //   }

  // }

  // Next() {
  //   const newday = (this.cd.d + 1) % this.monthsList[this.cd.m].nd;
  //   this.calendarService.setCurrentDate(newday, this.cd.d, this.cd.y);
  // }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
    // this.dateSubscription.unsubscribe();
  }

}
