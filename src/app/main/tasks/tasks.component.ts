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
  NTasks: Task[] = [];
  RTasks: Task[] = [];
  GTasks: Task[] = [];
  YTasks: Task[] = [];
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
    this.setLists();
    this.listSubscription = this.taskService.dayTAsksChanged.subscribe(tasks => {
      this.toDaysTasks = [];
      this.toDaysTasks.push(...tasks);
      this.setLists();
    });
    console.log('this.toDaysTasks -> ', this.toDaysTasks);
    // this.router.navigate(['./task-list'], {relativeTo: this.route});


  }

  RotateRight(list: Task[]) {
    const last = list.pop();
    list.unshift(last);
  }

  RotateLeft(list: Task[]) {
    const first = list.shift();
    list.push(first);
  }

  FilterList(filter: string) {
    return this.toDaysTasks.filter(t => t.color === filter).slice();
  }

  setLists() {
    this.NTasks = this.FilterList('');
    this.RTasks = this.FilterList('red');
    this.YTasks = this.FilterList('yellow');
    this.GTasks = this.FilterList('green');
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
