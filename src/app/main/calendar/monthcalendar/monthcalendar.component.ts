import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { CalendarService } from '../../calendar.service';
import { Day } from '../../day.model';
import { Task } from '../../task.model';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-monthcalendar',
  templateUrl: './monthcalendar.component.html',
  styleUrls: ['./monthcalendar.component.css']
})
export class MonthcalendarComponent implements OnInit, OnChanges, AfterViewInit {
  monthsList: {m: string, nd: number}[] = [];
  daysList: {n: string}[] = [];
  days: number[] = [];
  MLsize = 11;
  cd: {d: number, m: number, y: number};
  @Input()monthTasksList: Task[];

  constructor(
    private taskService: TaskService,
    private calendarService: CalendarService
    ) { }

  ngOnInit() {
    this.monthsList = this.calendarService.getMonthList();
    this.calendarService.changedDate
    .subscribe(date => {
      console.log('calendar date -> ', date);
      console.log('calendar cd -> ', this.cd);
      if (this.cd !== undefined && date !== undefined) {
        if (this.cd.m !== date.m) {
          console.log('?????????');
          this.RemoveMarks();
        }
      }
      this.cd = {
        d: date.d,
        m: date.m,
        y: date.y
      };

    });


    this.daysList = this.calendarService.getDaysList();
    console.log('current date -> ', this.cd);

    const daysInMonth = this.monthsList[this.cd.m].nd;
    // console.log('daysInMonth => ', daysInMonth);
    for (let i = 0; i < daysInMonth ; i++) {
      this.days.push(i + 1);
    }
    this.SetMonthInCalendar(this.cd.y, this.cd.m, 0);

  }

  ngOnChanges() {
    // console.log('this.monthTasksList -> ', this.monthTasksList);
    if (this.monthTasksList.length > 0 ) {
       setTimeout(() => {
        this.MarkDays();
       }, 0);
    }
  }

  ngAfterViewInit() {
    this.MarkDayOnCalendar(this.cd.d);
  }

  MarkDays() {
    this.monthTasksList.forEach(task => {
      console.log('for each task -> ', task);
      const index = this.days.indexOf(new Date(task.date).getDate());
      const i = new Date(task.date).getDate();
      (document.querySelectorAll('.test')[index]).classList.add(`background-${task.color}`);
    });
    this.MarkDayOnCalendar(this.cd.d);
  }

  RemoveMarks() {
    console.log('RemoveMarks -> ', this.cd);
    this.monthTasksList.forEach(task => {
      const index = this.days.indexOf(new Date(task.date).getDate());
      const i = new Date(task.date).getDate();
      (document.querySelectorAll('.test')[index]).classList.remove(`background-${task.color}`);
    });
    this.MarkDayOnCalendar(this.cd.d);
  }

  showDay() {
    return this.daysList;
  }

  // fd => first day in month, ld => last day in month
  NDinMonth(fd: number, ld: number, c: number) {
    // console.log('NDinMonth -> fd,ld,c -> ', fd, ld, c);
    const findex = this.days.indexOf(1);
    let num: number;
    if ( (this.cd.m) > 0) {
      // num = this.calendarService.getMonthLength(this.cd.m + c);
      num = this.monthsList[this.cd.m + c].nd;
      // console.log(' if  num -> ', num);
    } else {

      num = this.monthsList[11].nd;
      // console.log(' else  num -> ', num);
    }
    console.log('fd -> findex => ', fd, findex);
    if (fd < findex) {
      for (let i = 0; i < (findex - fd ) ; i++) {
        this.days.shift();
      }
    } else {
      for (let i = 0; i < (fd - findex ) ; i++) {
        this.days.unshift(undefined);
      }
    }
    if ( ld < num &&  ld < this.days.length) {
      console.log('ld < num -> ', ld , num);
      for (let i = 0; i < (num - ld); i++) {
        this.days.pop();
      }
    } else if (ld > num &&  ld > this.days.length) {
      console.log('ld > num => ', ld , num);
      for ( let i = 1; i <= (ld - num); i++) {
        this.days.push(num + i);
      }
    }
  }

  Perv() {
    let Month = (this.cd.m - 1) % 12;
    let Year = this.cd.y;
    if (Month !== -1) {
      this.calendarService.setCurrentDate(this.cd.d, Month, this.cd.y);
    } else {
      Month = this.MLsize;
      Year = this.cd.y - 1;
      this.calendarService.setCurrentDate(this.cd.d, Month, Year );
    }
    this.SetMonthInCalendar(Year, Month, 1);
  }

  Next() {
    const Month = (this.cd.m + 1) % 12;
    let Year = this.cd.y;
    if (Month === 0) {
      Year = this.cd.y + 1;
    }
    this.calendarService.setCurrentDate(this.cd.d, Month, Year);
    this.SetMonthInCalendar(Year, Month, -1);
  }

  SelectedDay(month: number, day: number) {
    console.log('selected day');
    const date = new Date(this.cd.y, month, day);

    this.UnMarkDayOnCalendar(this.cd.d);
    this.cd.d = day;
    this.calendarService.setCurrentDate(day, month, date.getFullYear());
    this.MarkDayOnCalendar(day);
  }

  MarkDayOnCalendar(day: number) {
    console.log('dat => ', day);
    document.getElementById(day.toString()).style.fontSize = '20px';
    document.getElementById(day.toString()).style.color = 'black';
  }

  UnMarkDayOnCalendar(day: number) {
    document.getElementById(day.toString()).style.fontSize = '15px';
    document.getElementById(day.toString()).style.color = 'white';
  }

  SetMonthInCalendar(year: number, month: number, c: number) {
    // in date 3th argument is day ==>
    // if enter 0 returns the last day from last month
    // if enter 1 returns the first ay in current month
    const firstDay = new Date(year, month , 1);
    this.NDinMonth(firstDay.getDay(), this.monthsList[month].nd, -1);
  }



}
