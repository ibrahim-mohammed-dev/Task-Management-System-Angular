import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/NavbarComponent';
import { EntitySelectorComponent } from './featuers/groupPage/components/ShowingList';
import { AuthService } from './service/AuthService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-final-project');
  user = signal<any>(null);
  authService = inject(AuthService);

  selectUser(item: any) {
    this.user.set(item);
  }
}
