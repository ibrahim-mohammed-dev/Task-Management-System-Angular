import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminService } from '../service/AdminService';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [],
  template: `
    <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;" dir="ltr">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin: 0;">Users Management</h2>
        
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label style="font-size: 0.875rem; color: #4b5563;">Rows per page:</label>
          <select 
            (change)="changePageSize(+$any($event.target).value)" 
            [value]="pageSize()"
            style="padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; background-color: #fff;">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      @if (usersResource.isLoading()) {
        <div style="display: flex; justify-content: center; align-items: center; padding: 3rem 0;">
          <p style="color: #6b7280; font-size: 1rem;">Loading users...</p>
        </div>
      }
      @else if (usersResource.error(); as err) {
        <div style="background-color: #fee2e2; border: 1px solid #f87171; color: #b91c1c; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1rem;">
          <p style="font-weight: bold; margin: 0 0 0.25rem 0;">Error loading users:</p>
          <p style="margin: 0;">{{  err.message || 'An unexpected error occurred.' }}</p>
        </div>
      }
      @else {
        @let res = users();
        
        @if (res && res.content && res.content.length > 0) {
          <div style="overflow-x: auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 0.5rem; background-color: #fff;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; color: #6b7280;">
              <thead style="font-size: 0.75rem; text-transform: uppercase; background-color: #f9fafb; color: #374151; border-bottom: 1px solid #e5e7eb;">
                <tr>
                  <th scope="col" style="padding: 0.75rem 1.5rem;">#ID</th>
                  <th scope="col" style="padding: 0.75rem 1.5rem;">Username</th>
                  <th scope="col" style="padding: 0.75rem 1.5rem;">Email</th>
                  <th scope="col" style="padding: 0.75rem 1.5rem;">Group</th>
                  <th scope="col" style="padding: 0.75rem 1.5rem;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (user of res.content; track user.id) {
                  <tr style="background-color: #fff; border-bottom: 1px solid #e5e7eb;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='#fff'">
                    <td style="padding: 1rem 1.5rem; font-weight: 500; color: #111827;">{{ user.id }}</td>
                    <td style="padding: 1rem 1.5rem;">{{ user.username }}</td>
                    <td style="padding: 1rem 1.5rem;">{{ user.email }}</td>
                    <td style="padding: 1rem 1.5rem;">
                      <span style="background-color: #dbeafe; color: #1e40af; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.625rem; border-radius: 9999px;">
                        {{ user.groupname }}
                      </span>
                    </td>
                    <td style="padding: 1rem 1.5rem; display: flex; gap: 0.75rem;">
                      <button style="color: #2563eb; background: none; border: none; cursor: pointer; padding: 0;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Edit</button>
                      <button style="color: #dc2626; background: none; border: none; cursor: pointer; padding: 0;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; font-size: 0.875rem; color: #4b5563;">
            <div>
              Total Users: <span style="font-weight: bold; color: #111827;">{{ res.totalElements }}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <button 
                class="btn-primary" 
                (click)="prevPage()" 
                [disabled]="currentPage() === 0"
                [style.opacity]="currentPage() === 0 ? '0.5' : '1'"
                [style.cursor]="currentPage() === 0 ? 'not-allowed' : 'pointer'"
                style="padding: 0.5rem 1rem; background-color: #2563eb; color: white; border: none; border-radius: 0.375rem; font-weight: 500;">
                Previous
              </button>

              <span>Page <span style="font-weight: bold; color: #111827;">{{ currentPage() + 1 }}</span> of <span style="font-weight: bold; color: #111827;">{{ res.totalPages || 1 }}</span></span>

              <button 
                class="btn-primary" 
                (click)="nextPage()" 
                [disabled]="currentPage() >= res.totalPages - 1"
                [style.opacity]="currentPage() >= res.totalPages - 1 ? '0.5' : '1'"
                [style.cursor]="currentPage() >= res.totalPages - 1 ? 'not-allowed' : 'pointer'"
                style="padding: 0.5rem 1rem; background-color: #2563eb; color: white; border: none; border-radius: 0.375rem; font-weight: 500;">
                Next
              </button>
            </div>
          </div>
        } 
        @else {
          <div style="text-align: center; padding: 3rem 0; background-color: #f9fafb; border-radius: 0.5rem; border: 1px dashed #d1d5db;">
            <p style="color: #6b7280; margin: 0;">No users available at the moment.</p>
          </div>
        }
      }
    </div>
  `
})
export class UsersManagementComponent {
    private adminService = inject(AdminService);
    currentPage = signal(0);
    pageSize = signal(10);

    usersResource = rxResource({
        params: () => ({ page: this.currentPage(), size: this.pageSize() }),
        stream: ({ params }) => this.adminService.showAllUsers(params.page, params.size)
    });

    users = this.usersResource.value;

    nextPage(): void {
        const total = this.users()?.totalPages ?? 0;
        if (this.currentPage() < total - 1) {
        this.currentPage.update(p => p + 1);
        }
    }

    prevPage(): void {
        if (this.currentPage() > 0) {
        this.currentPage.update(p => p - 1);
        }
    }

    changePageSize(newSize: number): void {
        this.pageSize.set(newSize);
        this.currentPage.set(0);
    }
}