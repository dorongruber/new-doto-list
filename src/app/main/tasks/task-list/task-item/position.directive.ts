import { AfterViewInit, Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appPosition]'
})
export class PositionDirective implements OnChanges, AfterViewInit {
  @Input('appPosition') index: number;
  @Input() elementRow: string;
  @HostBinding('style.zIndex')zIndex = '100';
  currentEl: HTMLElement;
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.index !== undefined) {
        this.zIndex = `${100 + this.index}`;
      }
  }

  ngAfterViewInit(): void {
    if (window.innerWidth <= 650) {
        this.initCarousel(this.index);
    }
  }
  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (window.innerWidth <= 650) {
      event.stopPropagation();
      const allElements = document.querySelectorAll(`.card-container.${this.elementRow}`);
      this.currentEl = (this.el.nativeElement.querySelector(`.card-container.${this.elementRow}`) as HTMLElement);
      this.currentEl.focus({preventScroll: false});
      this.currentEl.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
      this.setBeforeElementStyle(allElements);
      this.setCurrentElementStyle(this.currentEl, 'translatex(0) scale(1)', '1', 200);
      this.setAfterElementStyle(allElements);
    }
  }

  initCarousel(index) {
    this.currentEl = this.el.nativeElement.querySelector(`.card-container.${this.elementRow}`);
    if (index === 0) {
      this.setCurrentElementStyle(this.currentEl, 'translatex(0) scale(1)', '1', 200);
    } else {
      this.setCurrentElementStyle(this.currentEl, 'translatex(-0.5em) scale(.8)', '0.4', 100);
    }
  }

  setBeforeElementStyle(allEls) {
    const beforeIndex = (this.index - 1 + allEls.length) % allEls.length;
    const part = allEls[beforeIndex];
    part.style.transform = 'translatex(-0.5em) scale(.8)';
    part.style.opacity = '0.4';
    part.style.zIndex = 100;
  }

  setCurrentElementStyle(part, transform, opacity, zindex) {
    this.renderer.setStyle(part, 'transform', transform);
    this.renderer.setStyle(part, 'opacity', opacity);
    this.renderer.setStyle(part, 'zIndex', zindex);
  }

  setAfterElementStyle(allEls) {
    const afterIndex = (this.index + 1) % allEls.length;
    const part = allEls[afterIndex];
    part.style.transform = 'translatex(0.5em) scale(.8)';
    part.style.opacity = '0.4';
    part.style.zIndex = 100;
  }

}
