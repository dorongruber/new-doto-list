import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { Task } from '../task.model';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input() calendartasksList: Task[];
  @Input() currentRoute: string;
  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    console.log('this.currentRoute -> ', this.currentRoute);
  }

}
