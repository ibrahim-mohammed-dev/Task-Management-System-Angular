import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../service/AuthService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="app-navbar">
      <div class="nav-links">
        <a routerLink="/mytasks" routerLinkActive="active">مهماتي</a>
        <a routerLink="/groups" routerLinkActive="active">المجموعات</a>
        <a routerLink="/alltasks" routerLinkActive="active">كل المهام</a>
        <a routerLink="/allusers" routerLinkActive="active">المستخدمين</a>
      </div>
      
      <button class="btn-logout" (click)="onLogout()">
        <span class="icon">🚪</span> تسجيل الخروج
      </button>
    </nav>
  `,
  styles: [`
  .app-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  border-radius: 8px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  font-size: 15px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-links a:hover {
  color: #2563eb;
  background-color: #f3f4f6;
}

.nav-links a.active {
  color: #2563eb;
  background-color: #eff6ff;
  font-weight: 600;
}

.btn-logout {
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
}

.btn-logout:hover {
  background-color: #fecaca;
}`],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.clearAndRedirect(),
      error: () => this.clearAndRedirect()
    });
  }

  private clearAndRedirect(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    this.router.navigate(['/login']);
  }
}