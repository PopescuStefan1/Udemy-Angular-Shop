import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  collapsed = true;
  @Output() changeScreen = new EventEmitter<string>();

  onClick(event: Event) {
    event.preventDefault();
    const target = (event.target as HTMLElement)
      .closest('a')
      ?.getAttribute('data-target');
    if (target) {
      this.changeScreen.emit(target);
    }
  }
}
