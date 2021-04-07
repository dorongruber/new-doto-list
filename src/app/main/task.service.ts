import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Day } from './day.model';
import { CalendarService } from './calendar.service';
import { ImageSnippet } from './imagesnippet.model';

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
       .subscribe((date) => {
         let mf = false;
         let df = false;
         if (!this.date) {
            this.date = date;
            df = true;
            mf = true;
        } else {
          const lastday = this.date;
          this.date = date;
          if (lastday.m !== this.date.m) {
            mf = true;
          }
          if (lastday.d !== this.date.d) {
            df = true;
          }
        }

         if (mf) {
          this.InitMonthTaskList(this.date).toPromise()
          .then(tasks => {
            this.mounthTasksList = [];
            this.mounthTasksList.push(...tasks);
            this.mounthTAsksChanged.next(this.mounthTasksList.slice());
          });
        }

         if (df) {
          this.InitDayTaskList(this.date).toPromise()
          .then(tasks => {
            this.dayTasksList = [];
            this.dayTasksList.push(...tasks);
            this.dayTAsksChanged.next(this.dayTasksList.slice());
          });
        }


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
    console.log('new task -> ', nt);

    let formData = new FormData();
    formData.append('title', nt.title);
    formData.append('content', nt.content);
    formData.append('taskDate',  nt.date.toDateString());
    formData.append('color', nt.color);
    formData.append('id', JSON.stringify(nt.id));
    formData.append('userid', this.currentuser.userid);
    formData.append('img', nt.img.file);

    this.http.post<Task>(`${URI}newtask`, formData)
    .pipe(tap(resData => {
      const newTask = new Task(
        resData.title,
        resData.content,
        resData.date,
        resData.color,
        resData.id,
        resData.img
      );
      if (resData.color !== '') {
        this.mounthTasksList.push(newTask);
        this.mounthTAsksChanged.next(this.mounthTasksList.slice());
      }
      this.dayTasksList.push(newTask);
      this.dayTAsksChanged.next(this.dayTasksList.slice());
    })).subscribe();
    // look how to se response state
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
          id: task.id,
          img: task.img
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
          id: task.id,
          img: task.img
        };
      });
    }));
  }

  GetTasks() {
    console.log('get task function => ', this.mounthTasksList);
    return this.mounthTasksList.slice();
  }

  GetToDaysTasks() {
    return this.dayTasksList.slice();
  }

  DeleteTask(id: number) {
    this.http.delete(`${URI}removetask/${id}`).subscribe();
  }
}
