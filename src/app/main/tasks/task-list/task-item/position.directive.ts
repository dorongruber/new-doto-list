import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appPosition]'
})
export class PositionDirective implements OnInit {
  @Input('appPosition') index: number;
  @HostBinding('style.marginTop')marginTop: string;
  @HostBinding('style.marginLeft')marginLeft: string;
  @HostBinding('style.zIndex')zIndex: string;
  constructor() { }

  ngOnInit() {

    if ( this.index === 0) {
      this.marginTop = JSON.stringify(this.index);
      this.marginLeft = JSON.stringify(this.index);
      this.zIndex = '100';
    } else {
      const newMarginTop = .5 * this.index;
      const newMarginLeft = -19.5;
      const newZ = 100 - this.index;
      this.marginTop = JSON.stringify(newMarginTop) + 'em';
      this.marginLeft = JSON.stringify(newMarginLeft) + 'em';
      this.zIndex = JSON.stringify(newZ);
      console.log('Directive => ', newMarginTop, newMarginLeft);
    }





  }
}
