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
  @Input('appPosition') index!: number;
  @Input() elementRow!: string;
  @HostBinding('style.zIndex')zIndex = '100';
  currentEl: HTMLElement | null = null;
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['index'] !== undefined && window.innerWidth <= 650) {
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
      const allElements = (document.querySelectorAll(`.card-container.${this.elementRow}`) as NodeListOf<HTMLElement>);
      this.currentEl = (this.el.nativeElement.querySelector(`.card-container.${this.elementRow}`) as HTMLElement);
      this.currentEl.focus({preventScroll: false});
      this.currentEl.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
      this.setBeforeElementStyle(allElements);
      this.setCurrentElementStyle(this.currentEl, 'translatex(0) scale(1)', '1', 200);
      this.setAfterElementStyle(allElements);
    }
  }

  initCarousel(index: number) {
    this.currentEl = this.el.nativeElement.querySelector(`.card-container.${this.elementRow}`);
    if(this.currentEl == null)
      return;
    if (index === 0) {
      this.setCurrentElementStyle(this.currentEl, 'translatex(0) scale(1)', '1', 200);
    } else {
      this.setCurrentElementStyle(this.currentEl, 'translatex(-0.5em) scale(.8)', '0.4', 100);
    }
  }

  setBeforeElementStyle(allEls: NodeListOf<HTMLElement>) {
    const beforeIndex = (this.index - 1 + allEls.length) % allEls.length;
    const part = allEls[beforeIndex];
    this.setNeighborElementStyle(part, 'translatex(-0.5em) scale(.8)', '0.4', '100');
  }

  setCurrentElementStyle(part: HTMLElement, transform: string, opacity: string, zindex: number) {
    this.renderer.setStyle(part, 'transform', transform);
    this.renderer.setStyle(part, 'opacity', opacity);
    this.renderer.setStyle(part, 'zIndex', zindex);
  }

  setAfterElementStyle(allEls: NodeListOf<HTMLElement>) {
    const afterIndex = (this.index + 1) % allEls.length;
    const part = allEls[afterIndex];
    this.setNeighborElementStyle(part, 'translatex(0.5em) scale(.8)', '0.4', '100');
  }

  setNeighborElementStyle(part: HTMLElement, transform: string, opacity: string, zindex: string) {
    part.style.transform = transform;
    part.style.opacity = opacity;
    part.style.zIndex = zindex;
  }

}
