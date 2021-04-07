import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Task } from 'src/app/main/task.model';

@Component({
  selector: 'app-carditem',
  templateUrl: './carditem.component.html',
  styleUrls: ['./carditem.component.css']
})
export class CarditemComponent implements OnChanges {

  @Input()task: Task;
  @Input()index: number;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges() {
    console.log('task => ', this.task);
  }

  Transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.task.img.file);
  }

  DeleteTask() {

  }

}
