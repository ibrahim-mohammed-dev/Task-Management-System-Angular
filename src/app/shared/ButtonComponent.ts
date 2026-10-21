import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [type]="type()" 
      [disabled]="disabled() || loading()"
      class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
    >
      @if (loading()) {
        <span class="spinner"></span>
      }
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  type = input<'submit' | 'button' | 'reset'>('submit');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
}