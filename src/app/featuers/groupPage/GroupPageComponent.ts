import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShowingPagable } from './components/ShowingPageable';
import { CreateGroup } from './components/CreateGroup';
import { CreatePermission } from './components/CreatePermission';
import { AssignDeleteComponent } from './components/AssigningAndDeleteing';
import { EntitySelectorComponent } from './components/ShowingList';

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ShowingPagable,
    CreateGroup,
    CreatePermission,
    AssignDeleteComponent,
    EntitySelectorComponent
  ],
  template: `
    <div class="page-container">
      
      <!-- 1. زر إضافة جروب ومعاه مكان الكتابة (موجود جوه المكون نفسه) -->
      <section class="section-block">
        <app-create-group 
          (formSubmit)="onGroupCreated($event)" 
          (errorMessage)="onErrorMessage($event)" />
      </section>

      <!-- 2. زر إضافة صلاحية ونفس الكلام -->
      <section class="section-block">
        <app-create-permission 
          (formSubmit)="onPermissionCreated($event)" 
          (errorMessage)="onErrorMessage($event)" />
      </section>

      <!-- 3. قسم الـ Assign والـ Delete (السيليكتورز لاختيار الجروب والهدف + أزرار العمليات) -->
      <section class="section-block actions-section">
        <h3>Manage Assignments & Relations</h3>
        
        <div class="selectors-row">
          <app-entity-selector 
            [mode]="'groups-list'" 
            (itemSelected)="selectedGroupId.set($event.id)" />

          <app-entity-selector 
            [mode]="selectedMode.includes('user') ? 'users-list' : 'permissions-list'" 
            (itemSelected)="selectedTargetId.set($event.id)" />
        </div>

        <div class="modes-row">
          <select [(ngModel)]="selectedMode">
            <option value="assign-user">Assign User</option>
            <option value="assign-permission">Assign Permission</option>
            <option value="delete-user">Delete User</option>
            <option value="delete-permission">Delete Permission</option>
          </select>

          @if (selectedGroupId() && selectedTargetId()) {
            <app-assign-delete 
              [groupId]="selectedGroupId()!" 
              [targetId]="selectedTargetId()!" 
              [mode]="selectedMode"
              (successMessage)="onSuccessMessage($event)"
              (errorMessage)="onErrorMessage($event)" />
          }
        </div>
      </section>

      <!-- 4. عرض كل الجروبات بالطريقة المطلوبة -->
      <section class="section-block">
        <app-showing-pagable [mode]="'group-page'" />
      </section>

      <!-- 5. عرض كل الصلاحيات -->
      <section class="section-block">
        <app-showing-pagable [mode]="'permission-page'" />
      </section>

    </div>
  `,
  styles: [`
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .section-block {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
    }
    .actions-section h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1.1rem;
    }
    .selectors-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .modes-row {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .modes-row select {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #d1d5db;
    }
  `]
})
export class GroupPageComponent {
  selectedGroupId = signal<number | null>(null);
  selectedTargetId = signal<number | null>(null);
  selectedMode: 'assign-user' | 'assign-permission' | 'delete-user' | 'delete-permission' = 'assign-user';

  onGroupCreated(group: any) {
    console.log('Group created', group);
  }

  onPermissionCreated(permission: any) {
    console.log('Permission created', permission);
  }

  onSuccessMessage(msg: string) {
    console.log(msg);
  }

  onErrorMessage(err: string) {
    console.error(err);
  }
}