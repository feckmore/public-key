import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

// allow upper and lowercase, will be converted to uppercase only in color component
// const allowed:string = '.0aAbBcC1dDeEfF2gGhHiI3jJkKlL4mMnNoO5pPqQrR6sStTuU7vVwWxX8yYzZ9-';
// const allowed:string = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';

@Directive({
  selector: '[restrictCharacterInput]'
})
export class RestrictedInputDirective implements OnInit {
  @Input() characterSet: string = '';

  constructor(element: ElementRef) { }

  ngOnInit() {
    // console.log("directive characterSet value: ", this.characterSet);
  }

  @HostListener('keydown', ['$event']) onkeydown(event) {
    let e = <KeyboardEvent> event;
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow Select All: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow Copy: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow Paste: Ctrl+V
      // (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow Cut: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    console.log('characterSet: ' + this.characterSet);
    
    if (this.characterSet.indexOf(e.key) == -1) {
      e.preventDefault();
    }
  }
}
