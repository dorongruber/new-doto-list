import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Subscription } from 'rxjs';
import { CalendarService } from '../calendar.service';
import { ControlsService } from '../controls.service';
import { Day } from '../day.model';
import { ImageSnippet } from '../imagesnippet.model';
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
  selectedFile: ImageSnippet;
  sf = false;
  temp: any;
  constructor(
    private calendarService: CalendarService,
    private ng2ImgMax: Ng2ImgMaxService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
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
      color: new FormControl('', Validators.required),
      image: new FormControl('')
    });
  }

  onSubmit(form: NgForm) {
    console.log('new event -> ', form.value, this.currentDate);
    const date = new Date(this.currentDate.y, this.currentDate.m, this.currentDate.d);
    console.log('date element -> ', this.currentDate.y, this.currentDate.m, this.currentDate.d);

    if (!this.sf ) {
      const emptyFile = new File([], 'emptyfile');
      this.selectedFile = new ImageSnippet(emptyFile);
    }

    const newtask = new Task(form.value.title,
      form.value.desc,
      date,
      form.value.color,
      date.getTime(),
      this.selectedFile);
    this.taskService.NewTask(newtask);

  }

  ProcessFile(imageInput: any) {
    console.log('imageInput => ', this.form);
    const file: File = imageInput.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {
        if (file) {
          console.log('selected file');
          this.ng2ImgMax.resizeImage(file, 200, 150)
          .subscribe(result => {
            const newfile = new File([result], result.name);
            this.selectedFile = new ImageSnippet(newfile);
            this.sf = !this.sf;
          },
          error => {
            console.log('error => ', error);
          });
          // this.selectedFile = new ImageSnippet(file);

        } else {
          console.log('jhasbfabsdofibasdbfasd');
          const emptyFile = new File([], 'emptyfile');
          this.selectedFile = new ImageSnippet(emptyFile);
          this.sf = false;
        }
        this.temp = event.target.result;
        console.log('this.selectedFile => ', event.target.result);
        console.log('this.selectedFile => ', file);
      });

      reader.readAsDataURL(file);
    }

  }

  Transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.temp);
  }

  ReturnToMainPage() {
    // this.controlsService.SetSidenavState(false);
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.changedDateSub.unsubscribe();
  }
}
