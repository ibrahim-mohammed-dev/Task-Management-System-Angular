import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/NavbarComponent';
import { EntitySelectorComponent } from './featuers/groupPage/components/ShowingList';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,NavbarComponent,EntitySelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-final-project');
  user = signal<any>(null);

  selectUser(item: any) {
    this.user.set(item);
  }
}
