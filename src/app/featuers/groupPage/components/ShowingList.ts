import { Component, input, output, signal, computed, inject, ElementRef, HostListener } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminService } from '../../../service/AdminService';
import { GroupService } from '../../../service/GroupService';
import { PermissionService } from '../../../service/PermissionsService';

export type ListType = 'users-list' | 'groups-list' | 'permissions-list';

@Component({
  selector: 'app-entity-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="entity-selector-container" #container>
      <!-- Input Field acting as search & display for selected item -->
      <div class="input-wrapper" (click)="openDropdown()">
        <input 
          type="text" 
          [placeholder]="inputPlaceholder()"
          [ngModel]="searchQuery()"
          (ngModelChange)="onSearchChange($event)"
          (focus)="openDropdown()"
        />
        @if (selectedItemName()) {
          <span class="selected-badge" title="Selected">✓ Selected</span>
        }
      </div>

      <!-- Dropdown Results Box (Hidden by default) -->
      @if (isOpen()) {
        <div class="dropdown-box">
          @if (dataResource.isLoading()) {
            <div class="state-msg">Loading...</div>
          } @else {
            <ul class="items-list">
              @for (item of displayData(); track item.id) {
                <li 
                  [class.selected]="selectedId() === item.id"
                  (click)="selectItem(item)"
                >
                  <span class="item-text">{{ formatItemLabel(item) }}</span>
                  @if (selectedId() === item.id) {
                    <span class="check-icon">✓ Selected</span>
                  }
                </li>
              } @empty {
                <li class="state-msg">{{ emptyMessage() }}</li>
              }
            </ul>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .entity-selector-container {
      position: relative;
      width: 100%;
      max-width: 380px;
      font-family: inherit;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-wrapper input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      font-size: 0.95rem;
      outline: none;
      background: #fff;
      transition: border-color 0.2s;
    }
    .input-wrapper input:focus {
      border-color: #1677ff;
      box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
    }
    .selected-badge {
      position: absolute;
      right: 12px;
      font-size: 0.75rem;
      background: #f6ffed;
      color: #52c41a;
      border: 1px solid #b7eb8f;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }
    .dropdown-box {
      position: absolute;
      top: 105%;
      left: 0;
      right: 0;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      z-index: 1000;
      max-height: 240px;
      overflow-y: auto;
    }
    .items-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .items-list li {
      padding: 10px 14px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.9rem;
      transition: background 0.15s;
    }
    .items-list li:last-child { border-bottom: none; }
    .items-list li:hover { background-color: #f5f5f5; }
    .items-list li.selected {
      background-color: #e6f4ff;
      color: #1677ff;
      font-weight: 600;
    }
    .check-icon {
      color: #1677ff;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .state-msg {
      text-align: center;
      color: #8c8c8c;
      padding: 12px;
      font-size: 0.85rem;
    }
  `]
})
export class EntitySelectorComponent {
  private adminService = inject(AdminService);
  private elementRef = inject(ElementRef);
  private groupService = inject(GroupService);
  private permissionService = inject(PermissionService);

  mode = input.required<ListType>();
  itemSelected = output<any>();

  // State
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedId = signal<any | null>(null);
  selectedItemName = signal<string>('');

  // 🟢 1. إنشاء Subject للتحكم في تدفق البحث ومنع إرسال طلبات متكررة للسيرفر
  private searchSubject = new Subject<string>();

  // 🟢 2. تحويل الـ Subject إلى Signal مع تأخير 300 جزء من الثانية (Debounce)
  debouncedQuery = toSignal(
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  inputPlaceholder = computed(() => {
    if (this.selectedItemName()) return this.selectedItemName();
    switch (this.mode()) {
      case 'users-list': return 'Type to search user...';
      case 'groups-list': return 'Select or search group...';
      case 'permissions-list': return 'Select or search permission...';
    }
  });

  emptyMessage = computed(() => {
    if (this.mode() === 'users-list' && !this.searchQuery().trim()) {
      return 'Type at least 1 character to search...';
    }
    return 'No results found';
  });

  // Data Resource handling server-side vs client-side loading rules
  dataResource = rxResource({
    params: () => ({
      mode: this.mode(),
      // نعتمد على debouncedQuery للـ Users حتى ينتظر توقف الكتابة، بينما نبقي searchQuery للمجاميع للفلترة الفورية
      userQuery: this.debouncedQuery(),
      isOpen: this.isOpen()
    }),
    stream: ({ params }) => {
      // For Users: Do NOT load anything if dropdown is closed or query is empty
      if (params.mode === 'users-list') {
        if (!params.isOpen || !params.userQuery.trim()) {
          return of({ content: [], totalPages: 0 });
        }
        return this.adminService.searchUsers(params.userQuery, 0, 10);
      }

      // For Groups & Permissions: Load initial list when opened
      if (params.isOpen) {
        if (params.mode === 'groups-list') {
          return this.groupService.showAllGroups(0, 50);
        } else {
          return this.permissionService.showAllPermissions(0, 50);
        }
      }

      return of({ content: [], totalPages: 0 });
    },
    defaultValue: { content: [], totalPages: 0 }
  });

  rawItems = computed(() => {
    const res = this.dataResource.value() as any;
    if (this.mode() === 'users-list') {
      return Array.isArray(res?.content) ? res.content : [];
    }
    if (Array.isArray(res)) {
      return res;
    }
    return Array.isArray(res?.content) ? res.content : [];
  });

  displayData = computed(() => {
    const items = this.rawItems();
    const query = this.searchQuery().toLowerCase().trim();

    if (this.mode() === 'users-list' || !query) {
      return items;
    }

    // Client-side filtering for groups & permissions (فوري محلياً)
    return items.filter((item: any) => 
      item.name?.toLowerCase().includes(query)
    );
  });

  openDropdown() {
    this.isOpen.set(true);
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value); // لتحديث واجهة الحقل فوراً
    this.searchSubject.next(value); // لإرسال القيمة للـ Subject ليطبق الـ Debounce للباك إند
    this.isOpen.set(true);
  }

  selectItem(item: any) {
    this.selectedId.set(item.id);
    const label = this.formatItemLabel(item);
    this.selectedItemName.set(label);
    this.searchQuery.set(''); 
    this.searchSubject.next(''); // تفريغ الـ Subject أيضاً عند الاختيار
    this.isOpen.set(false);   
    this.itemSelected.emit(item);
  }

  formatItemLabel(item: any): string {
    if (this.mode() === 'users-list') {
      return `${item.username} (${item.email})`;
    } else {
      return item.name;
    }
  }
}