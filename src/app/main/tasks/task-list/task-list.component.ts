import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Task } from '../../task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() taskList!: Task[];
  @Input()type!: string;
  @Input() row!: string;
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

}
