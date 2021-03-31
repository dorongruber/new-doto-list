import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIcon } from '@angular/material/icon';
import { ControlsService } from './controls.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isLoading = false;
  lastIndex: number;
  routesList = [false, false, false];

  constructor(
    private controlsService: ControlsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.opened = this.controlsService.GetSidenavState();
    // this.sideNavChanged = this.controlsService.sidenavOpenChanged
    //   .subscribe( res => {
    //     console.log('subscribe res -> ', res);
    //     this.opened = res;
    //     if (!res) {
    //       this.routesList[0] = false;
    //       this.routesList[1] = false;
    //     }
    //   });
    // this.isLoading = true;
    // this.monthTasksList = this.taskService.GetTasks();
    // this.montSubscription = this.taskService.mounthTAsksChanged
    //   .subscribe(tasks => {
    //     console.log('new color task -> ', tasks);
    //     this.monthTasksList = [];
    //     this.monthTasksList.push(...tasks);
    //     console.log('this.monthTasksList subscribe -> ', this.monthTasksList);
    // });
    this.isLoading = false;
    this.routesList[2] = true;
    this.lastIndex = 2;
    this.router.navigate(['./monthtasks'], {relativeTo: this.route});
  }


  onRouteSelect(route: string, ref: MatIcon) {

    switch (ref._elementRef.nativeElement.id) {
      case 'new-event':
        this.routesList[0] = true;
        this.routesList[this.lastIndex] = false;
        this.lastIndex = 0;
        break;
      case 'events-list':
        this.routesList[1] = true;
        this.routesList[this.lastIndex] = false;
        this.lastIndex = 1;
        break;
      case 'month-tasks':
        this.routesList[2] = true;
        this.routesList[this.lastIndex] = false;
        this.lastIndex = 2;
        break;

    }
    this.router.navigate([route], {relativeTo: this.route});

  }

}
