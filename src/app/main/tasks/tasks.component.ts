import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.toDaysTasks = this.taskService.getToDaysTasks();
    this.setLists();
    this.listSubscription = this.taskService.dayTAsksChanged.subscribe(tasks => {
      this.toDaysTasks = [];
      this.toDaysTasks.push(...tasks);
      this.setLists();
    });
    console.log('this.toDaysTasks -> ', this.toDaysTasks);
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
    console.log('FilterList ', filter, this.toDaysTasks);

    return this.toDaysTasks.filter(t => t.color === filter).slice();
  }

  setLists() {
    this.NTasks = this.FilterList('');
    this.RTasks = this.FilterList('red');
    this.YTasks = this.FilterList('yellow');
    this.GTasks = this.FilterList('green');
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

}
