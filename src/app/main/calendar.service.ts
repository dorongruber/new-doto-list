import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Day } from './day.model';

@Injectable({providedIn: 'root'})
export class CalendarService {
  defaultDate: Date = new Date();
  currentDate!: Day;
  changedDate = new BehaviorSubject<Day>(
    new Day(this.defaultDate.getDate(), this.defaultDate.getMonth(), this.defaultDate.getFullYear())
    );

  constructor() {
    const date = new Date();
    console.log('calender service con');
    this.setCurrentDate(date.getDate(), date.getMonth(), date.getFullYear());
  }

  monthsList = [{m: 'January', nd: 31}, {m: 'February', nd: 29}, {m: 'March', nd: 31}, {m: 'April', nd: 30} ,
  {m: 'May', nd: 31}, {m: 'June', nd: 30}, {m: 'July', nd: 31}, {m: 'August', nd: 31},
  {m: 'September', nd: 30}, {m: 'October', nd: 31}, {m: 'November', nd: 30}, {m: 'December', nd: 31}];

  daysList = [{n: 'Mo'}, {n: 'tu'}, {n: 'We'}, {n: 'Th'}, {n: 'Fr'}, {n: 'Sa'}, { n: 'Su'}];

    setCurrentDate(day: number, month: number, year: number) {
      console.log('setcurrentdate');
      this.currentDate = {
        d: day,
        m: month,
        y: year
      };
      this.changedDate.next({d: day, m : month, y: year});
    }

    getCurrentDate() {
      return this.currentDate;
    }

    getMonthList() {
      return this.monthsList.slice();
    }

    getDaysList() {
      return this.daysList.slice();
    }

    getMonthLength(index: number) {
      return this.monthsList.slice()[index].nd;
    }

}
