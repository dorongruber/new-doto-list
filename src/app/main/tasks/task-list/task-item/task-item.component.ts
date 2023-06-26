import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/main/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  @Input()task!: Task;
  @Input()index!: number;
  @Input()type!: string;
  @Input() row!: string;
  color!: string;
  day!: number;
  constructor() { }

  ngOnInit() {

  }

}
