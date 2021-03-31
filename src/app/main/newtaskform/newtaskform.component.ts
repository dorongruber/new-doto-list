import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService } from '../calendar.service';
import { ControlsService } from '../controls.service';
import { Day } from '../day.model';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-newtaskform',
  templateUrl: './newtaskform.component.html',
  styleUrls: ['./newtaskform.component.css']
})
export class NewtaskformComponent implements OnInit, OnDestroy {
  @ViewChild('taskForm', {static: false})form: FormGroup;
  list: Task[] = [];
  currentDate: Day;
  changedDateSub: Subscription;
  taskForm: FormGroup;
  dateStr: string;

  constructor(
    private calendarService: CalendarService,
    private controlsService: ControlsService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentDate = this.calendarService.getCurrentDate();
    this.changedDateSub = this.calendarService.changedDate
    .subscribe( newdate => {
      this.currentDate = newdate;
      this.dateStr = `${this.currentDate.d} \\ ${this.currentDate.m + 1} \\ ${this.currentDate.y}`;
      this.InitForm();
    });
    this.InitForm();


  }

  InitForm() {
    console.log('datestr -> ', this.dateStr);
    this.taskForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25)
      ]),
      desc: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      date: new FormControl({value: this.dateStr, disabled: false}, [
        Validators.required
      ]),
      color: new FormControl('', Validators.required)
    });
  }

  onSubmit(form: NgForm) {
    console.log('new event -> ', form.value, this.currentDate);
    const date = new Date(this.currentDate.y, this.currentDate.m, this.currentDate.d);
    console.log('date element -> ', this.currentDate.y, this.currentDate.m, this.currentDate.d);
    const newtask = new Task(form.value.title,
      form.value.desc,
      date,
      form.value.color,
      date.getTime());
    this.taskService.NewTask(newtask);

  }

  ReturnToMainPage() {
    this.controlsService.SetSidenavState(false);
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.changedDateSub.unsubscribe();
  }
}
