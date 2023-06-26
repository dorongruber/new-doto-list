import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Task } from 'src/app/main/task.model';

@Component({
  selector: 'app-eventfullscreendialog',
  templateUrl: './eventfullscreendialog.component.html',
  styleUrls: ['./eventfullscreendialog.component.css']
})
export class EventfullscreendialogComponent implements OnInit {

  day!: number;
  month!: number;
  year!: number;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<EventfullscreendialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) { }

  ngOnInit() {
    const date = new Date(this.data.date);
    this.day = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }

  Transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.data.img.file);
  }

  onClose() {
    this.dialogRef.close();
  }

}


