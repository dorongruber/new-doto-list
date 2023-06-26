import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/main/task.model';

@Component({
  selector: 'app-panelitem',
  templateUrl: './panelitem.component.html',
  styleUrls: ['./panelitem.component.css']
})
export class PanelitemComponent implements OnInit {
  @Input()task!: Task;
  @Input()index!: number;
  color!: string;
  day!: number;
  constructor() { }

  ngOnInit() {
    this.day = new Date(this.task.date).getDate();
    this.color = this.task.color;
    (document.querySelectorAll('.date-container')[this.index]).classList.add(`background-${this.color}`);
  }

}
