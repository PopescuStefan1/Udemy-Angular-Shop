import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loginMode = false;

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }
}
