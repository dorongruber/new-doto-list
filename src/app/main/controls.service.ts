import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ControlsService {
  isSidenavOpen = false;
  sidenavOpenChanged = new Subject<boolean>();

  SetSidenavState(newState: boolean) {
    this.isSidenavOpen = newState;
    this.sidenavOpenChanged.next(newState);
  }

  GetSidenavState() {
    return this.isSidenavOpen;
  }
}
