import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Day } from './day.model';
import { CalendarService } from './calendar.service';

// const URI = 'http://localhost:8080/api/task/';
const URI = 'https://guarded-sea-67886.herokuapp.com/api/task/';

@Injectable({providedIn: 'root'})
export class TaskService {
  currentuser: {userid: string};
  date: Day;
  userChanged: Subscription;
  dayTasksList: Task[] = [];
  dayTAsksChanged = new Subject<Task[]>();
  mounthTasksList: Task[] = [];
  mounthTAsksChanged = new Subject<Task[]>();
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private calendarService: CalendarService
    ) {
       this.authService.user.subscribe(user => {
        console.log('new user in service -> ', user);
        if (user) {
          this.SetCurrentUser(user.pass);
        }
      });



       this.calendarService.changedDate
       .subscribe(async (date) => {
        this.date = date;
        // this.InitTaskList(this.date).subscribe(tasks => {
        //   console.log('InitTaskList subscribe tasks -> ', tasks);
        //   // this.dayTasksList.push(...tasks);
        //   this.dayTAsksChanged.next(this.dayTasksList.slice());
        // });
        const monthlist = await this.InitMonthTaskList(this.date).toPromise();
        monthlist.forEach(task => {
          console.log('InitMonthTaskList => task ->  ', task);
          this.mounthTasksList.push(task);
          this.mounthTAsksChanged.next(this.mounthTasksList.slice());
        });
        const templist = await this.InitDayTaskList(this.date).toPromise();
        this.dayTasksList = [];
        this.dayTasksList.push(...templist);
        this.dayTAsksChanged.next(this.dayTasksList.slice());
        templist.forEach(task => {
          const checkTask = this.mounthTasksList.filter(Ltask => Ltask.id === task.id);
          console.log('check test -> ', checkTask);
          if (task.color !== '' && checkTask.length === 0) {
            this.mounthTasksList.push(task);
            this.mounthTAsksChanged.next(this.mounthTasksList.slice());
          }
        });
        console.log('dayTasksList -> ', this.dayTasksList);
      });

    }


  GetSelectedDate() {
    return this.date;
  }

  SetCurrentUser(uid: string) {
    this.currentuser = {
      userid: uid
    };
  }

  NewTask(nt: Task) {
    const dbtaskformat = {
      title: nt.title,
      content: nt.content,
      taskDate: nt.date,
      color: nt.color,
      id: nt.id,
      userid: this.currentuser.userid
    };
    console.log('new task -> ', dbtaskformat);
    console.log('new task -> ', nt.date);
    // return this.http.post(`${URI}newtask`, dbtaskformat);
    this.http.post<Task>(`${URI}newtask`, dbtaskformat)
    .pipe(tap(resData => {
      const newTask = new Task(
        resData.title,
        resData.content,
        resData.date,
        resData.color,
        resData.id
      );
      if (resData.color !== 'none') {
        this.mounthTasksList.push(newTask);
        this.mounthTAsksChanged.next(this.mounthTasksList.slice());
      }
      this.dayTasksList.push(newTask);
      this.dayTAsksChanged.next(this.dayTasksList.slice());
    })).subscribe();
    // look how to se response state
  }

  GetCurrentDayTasks(date: string) {
    // console.log('GetCurrentDayTasks : ', date);

    const uid = this.currentuser.userid;
    return this.http.get(`${URI}todaystasks/${date}/${uid}`);
  }

  // TODO change how i resevie data from http.get
  InitDayTaskList(date: Day) {
    console.log('InitTaskList');
    const dayId = new Date(date.y, date.m, date.d).getTime();
    const uid = this.currentuser.userid;
    return this.http.get<{tasksList: Task[]}>(`${URI}todaystasks/${dayId}/${uid}`)
    .pipe(map(resData => {
      return resData.tasksList.map(task => {
        return {
          title: task.title,
          content: task.content,
          date: task.date,
          color: task.color,
          id: task.id
        };
      });
    }));
  }

  InitMonthTaskList(date: Day) {
    const month = JSON.stringify(date.m);
    const uid = this.currentuser.userid;
    // console.log('InitMonthTaskList -> ', month, uid);
    return this.http.get<{monthTaskList: Task[]}>(`${URI}monthtasks/${month}/${uid}`)
    .pipe(map(resData => {
      // console.log('InitMonthTaskList resData -> ', resData);
      return resData.monthTaskList.map(task => {
        return {
          title: task.title,
          content: task.content,
          date: task.date,
          color: task.color,
          id: task.id
        };
      });
    }));
  }

  GetTasks() {
    return this.mounthTasksList.slice();
  }

  GetToDaysTasks() {
    return this.dayTasksList.slice();
  }

  DeleteTask(id: number) {
    this.http.delete(`${URI}removetask/${id}`).subscribe();
  }
}
