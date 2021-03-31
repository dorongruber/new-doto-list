import { Directive, HostBinding, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightDay]'
})
export class HighlightDayDirective implements OnInit, OnChanges {

  defaultColor = 'transparent';
  @Input('appHighlightDay') highlightColor: string;
  @HostBinding('style.backgroundColor') backgroundColor: string;
  constructor() { }
  ngOnInit() {
    this.backgroundColor = this.defaultColor;
  }

  ngOnChanges() {
    this.backgroundColor = this.highlightColor;
  }

}
