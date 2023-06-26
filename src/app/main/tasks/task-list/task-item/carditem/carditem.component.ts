import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Task } from 'src/app/main/task.model';
import { TaskService } from 'src/app/main/task.service';
import { EventfullscreendialogComponent } from '../eventfullscreendialog/eventfullscreendialog.component';

@Component({
  selector: 'app-carditem',
  templateUrl: './carditem.component.html',
  styleUrls: ['./carditem.component.css']
})
export class CarditemComponent implements OnChanges {

  @Input()task!: Task;
  @Input()index!: number;
  @Input() row!: string;
  constructor(
    private sanitizer: DomSanitizer,
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnChanges() {
    console.log('task => ', this.task);
  }

  Transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.task.img.file);
  }

  OpenDialog() {
    const dialogRef = this.dialog.open(EventfullscreendialogComponent, {
      maxWidth: '100vw',
      width: '100vw',
      height: '90vh',
      data: this.task
    });

    dialogRef.afterClosed()
    .subscribe(result => {
    });
  }

  DeleteTask() {
    this.taskService.DeleteTask(this.task.id);
  }

}
