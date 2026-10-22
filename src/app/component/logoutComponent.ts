import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/AuthService';

@Component({
  selector: 'app-logout',
  template:`
    <button class="btn-logout" (click)="onLogout()">
        <span class="icon">🚪</span> Logout
    </button>
`,
styleUrl: '../componentstyles/LogoutComponent.css'
})
export class LogoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response);
        this.clearAndRedirect();
      },
      error: (err) => {
        this.clearAndRedirect();
      }
    });
  }
  private clearAndRedirect(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    this.router.navigate(['/login']);
  }
}