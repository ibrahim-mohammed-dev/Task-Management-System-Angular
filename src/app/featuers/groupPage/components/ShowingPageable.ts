import { Component, computed, inject, input, signal } from "@angular/core";
import { GroupService } from "../../../service/GroupService";
import { PermissionService } from "../../../service/PermissionsService";
import { rxResource } from "@angular/core/rxjs-interop";


export type PageableType = 'permission-page' | 'group-page';
@Component({
    selector: 'app-showing-pagable',
    template: `
    <div class="pagable-container">
  <!-- العنوان في الأعلى على اليسار -->
  <div class="header-section">
    <h2 class="page-title">{{ label() }}</h2>
  </div>

  @if (errorMessage()) {
    <div class="alert error">
      {{ errorMessage() }}
    </div>
  }

  <div class="table-card">
    @if (dataResource.value().content.length > 0) {
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th class="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of dataResource.value().content; track item.id) {
              <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.name}}</td>
                <td class="actions-col">
                  <button class="btn-delete" (click)="onDelete(item.id)">
                    <svg class="icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Delete
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <div class="empty-state">
        <p>No records found.</p>
      </div>
    }
  </div>
</div>
    `,
    styles: [`.pagable-container {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
}

/* محاذاة العنوان إلى أعلى اليسار */
.header-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  text-align: left;
}

.alert.error {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.925rem;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;
}

.data-table th, 
.data-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.actions-col {
  text-align: right;
  width: 140px;
}

.btn-delete {
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #fecaca;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
}`]

})
export class ShowingPagable {
    private groupService = inject(GroupService);
    private permissionService = inject(PermissionService);
    
    errorMessage = signal<string>('');
    private refreshTrigger = signal<number>(0); 

    mode = input.required<PageableType>(); 

    label = computed(() => {
        switch(this.mode()){
            case 'permission-page': return 'Existing Permissions';
            case 'group-page': return 'Existing Groups';
            default: return '';
        }
    });

    dataResource = rxResource({
        params: () => ({ 
            mode: this.mode(),
            refresh: this.refreshTrigger() 
        }),
        stream: ({ params }) => {
            if (params.mode === 'permission-page') {
                return this.permissionService.showAllPermissions();
            } else {
                return this.groupService.showAllGroups();
            }
        },
        defaultValue: { 
            content: [], 
            totalPages: 0, 
            totalElements: 0 
        }
    });

    onDelete(id: number) {
        this.errorMessage.set(''); 
        
        const deleteObservable = this.mode() === 'permission-page'
            ? this.permissionService.deletePermission(id)
            : this.groupService.deleteGroup(id);

        deleteObservable.subscribe({
            next: () => {
                this.refreshTrigger.update(val => val + 1);
            },
            error: err => {
                this.errorMessage.set(err.error?.message || 'Something went wrong');
            }
        });
    }
}