import { Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appPosition]'
})
export class PositionDirective implements OnChanges {
  @Input('appPosition') index: number;
  @HostBinding('style.marginTop')marginTop: string;
  @HostBinding('style.marginLeft')marginLeft: string;
  @HostBinding('style.zIndex')zIndex: string;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }

  ngOnChanges() {
    if ( this.index === 0) {
      this.marginTop = JSON.stringify(this.index);
      // this.marginLeft = '1em';
      this.zIndex = '100';
    } else {
      // const newMarginTop = .5 * this.index;
      const newMarginTop = 0;
      // const newMarginLeft = -10.5;
      const newZ = 100 + this.index;
      this.marginTop = JSON.stringify(newMarginTop) + 'em';
      // this.marginLeft = JSON.stringify(newMarginLeft) + 'em';
      this.zIndex = JSON.stringify(newZ);
      // console.log('Directive => ', newMarginTop, newMarginLeft);
    }
  }
  @HostListener('mouseover', ['$event']) onMouseOver(event: MouseEvent) {
    // event.stopPropagation();
    // const part = this.el.nativeElement.querySelector('.card-container');
    // this.renderer.setStyle(part, 'zIndex', '200');
  }

  @HostListener('mouseout', ['$event']) onMouseOut(event: MouseEvent) {
    // event.stopPropagation();
    // onst part = this.el.nativeElement.querySelector('.card-container');
    // this.renderer.setStyle(part, 'zIndex', this.zIndex);
  }
}
