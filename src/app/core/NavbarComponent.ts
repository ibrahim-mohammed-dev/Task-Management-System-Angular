import { Component } from '@angular/core';
import { LogoutComponent } from '../component/logoutComponent';


@Component({
  selector: 'app-navbar',
  imports: [LogoutComponent],
  template: `
  <app-logout />
  `
})
export class NavbarComponent {
  
}