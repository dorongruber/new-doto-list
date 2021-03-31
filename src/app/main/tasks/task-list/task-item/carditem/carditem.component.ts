import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/main/task.model';

@Component({
  selector: 'app-carditem',
  templateUrl: './carditem.component.html',
  styleUrls: ['./carditem.component.css']
})
export class CarditemComponent implements OnInit {

  @Input()task: Task;
  @Input()index: number;
  constructor() { }

  ngOnInit() {
  }

  DeleteTask() {

  }

}
