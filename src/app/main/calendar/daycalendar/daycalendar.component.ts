import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService } from '../../calendar.service';
import { Day } from '../../day.model';

@Component({
  selector: 'app-daycalendar',
  templateUrl: './daycalendar.component.html',
  styleUrls: ['./daycalendar.component.css']
})
export class DaycalendarComponent implements OnInit, OnDestroy {
  cd: Day;
  monthsList: {m: string, nd: number}[] = [];

  dateSubscription: Subscription;
  constructor(
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.monthsList = this.calendarService.getMonthList();
    this.cd = this.calendarService.getCurrentDate();

    this.dateSubscription = this.calendarService.changedDate
    .subscribe(date => {
      console.log('dat component -> ', date);
      this.cd = {
        d: date.d,
        m: date.m,
        y: date.y
      };
    });
  }

  Perv() {
    let newday = (this.cd.d - 1) % this.monthsList[this.cd.m].nd;
    if (newday > 0) {
      // this.m = newmount;
      this.calendarService.setCurrentDate(newday, this.cd.m, this.cd.y);
    } else {
      newday = this.monthsList[this.cd.m].nd;
      this.calendarService.setCurrentDate(newday, this.cd.m, this.cd.y );
    }

  }

  Next() {
    let newday = (this.cd.d + 1) % this.monthsList[this.cd.m].nd;
    if (newday === 0) {
      newday = 1;
    }
    this.calendarService.setCurrentDate(newday, this.cd.m, this.cd.y);
  }

  ngOnDestroy() {
    this.dateSubscription.unsubscribe();
  }

}
