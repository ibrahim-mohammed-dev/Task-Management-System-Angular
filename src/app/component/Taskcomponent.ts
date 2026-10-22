import { Component, inject, signal } from "@angular/core";
import { toSignal, toObservable } from "@angular/core/rxjs-interop";
import { catchError, of, switchMap } from "rxjs";
import { RestResponsePage } from "../dto/ResetResponsePage";
import { TaskResponseDto } from "../dto/TaskResponseDto";
import { TaskService } from "../service/TaskService";
import { TaskRequestDto } from "../dto/TaskRequestDto";
import { TaskFormComponent } from "../shared/TaskFormComponent";

@Component({
  selector: 'app-task-list',
  imports: [TaskFormComponent],
  template: `
    <div class="tasks-container">
      <header class="tasks-header">
        <h1>My Tasks</h1>
        <button class="btn-primary" (click)="openAddModal()">Add Task</button>
      </header>

      @if (errorMessage()) {
        <div class="error-banner">{{ errorMessage() }}</div>
      }

      <div class="tasks-grid">
        @for (task of tasks().content; track task.id) {
          <div class="task-card">
            <div class="task-info">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
            </div>
            <div class="task-actions">
              <button class="btn-update" (click)="openUpdateModal(task)">Update</button>
              <button class="btn-delete" (click)="deleteTask(task.id)">Delete</button> 
            </div>
          </div>
        } @empty {
          <p class="no-tasks">No tasks found. Click "Add Task" to create one.</p>
        }
      </div>

      @if (isAddModalOpen()) {
        <div class="modal-backdrop">
          <div class="modal-content">
            <div class="modal-header">
              <h2>Add New Task</h2>
              <button class="close-btn" (click)="closeAddModal()">&times;</button>
            </div>
            <div class="modal-body">
              <app-task-form (formSubmit)="onAddSubmit($event)" />
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="closeAddModal()">Cancel</button>
            </div>
          </div>
        </div>
      }

      @if (isUpdateModalOpen()) {
        <div class="modal-backdrop">
          <div class="modal-content">
            <div class="modal-header">
              <h2>Update Task</h2>
              <button class="close-btn" (click)="closeUpdateModal()">&times;</button>
            </div>
            <div class="modal-body">
              <app-task-form [initialData]="selectedTask()" (formSubmit)="onUpdateSubmit($event)" />
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="closeUpdateModal()">Cancel</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: '../componentstyles/TaskComponent.css'
})
export class TaskComponent {
  private taskService = inject(TaskService); 

  errorMessage = signal<string>('');
  isAddModalOpen = signal<boolean>(false);
  isUpdateModalOpen = signal<boolean>(false);
  selectedTask = signal<TaskResponseDto | null>(null);

  // إشارة لتحديث البيانات، ومحولتها إلى Observable لتقبل .pipe()
  private refreshTrigger = signal<void>(undefined);

  tasks = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() => this.taskService.getTasks().pipe(
        catchError((error: unknown) => {
          console.error("Error fetching tasks", error);
          return of({ 
            content: [], 
            totalElements: 0, 
            totalPages: 0, 
            size: 10, 
            number: 0 
          } as RestResponsePage<TaskResponseDto>);
        })
      ))
    ),
    { 
      initialValue: { 
        content: [], 
        totalElements: 0, 
        totalPages: 0, 
        size: 10, 
        number: 0 
      } as RestResponsePage<TaskResponseDto> 
    }
  );

  openAddModal(): void {
    this.errorMessage.set('');
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  openUpdateModal(task: TaskResponseDto): void {
    this.errorMessage.set('');
    this.selectedTask.set(task);
    this.isUpdateModalOpen.set(true);
  }

  closeUpdateModal(): void {
    this.selectedTask.set(null);
    this.isUpdateModalOpen.set(false);
  }

  onAddSubmit(task: TaskRequestDto): void {
    this.taskService.addTask(task).subscribe({
      next: (data) => {
        console.log("new task added =", data);
        this.closeAddModal();
        this.refreshTrigger.set(undefined); // إعادة جلب المهام
      },
      error: (err: unknown) => {
        const message = (err as any)?.error?.message || 'Failed to add task';
        this.errorMessage.set(message);
      }
    });
  }

  onUpdateSubmit(task: TaskRequestDto): void {
    const currentTask = this.selectedTask();
    if (!currentTask) return;

    this.taskService.updateTask(currentTask.id, task).subscribe({
      next: res => {
        console.log('task updated successfully', res);
        this.closeUpdateModal();
        this.refreshTrigger.set(undefined); // إعادة جلب المهام
      },
      error: (err: unknown) => {
        const message = (err as any)?.error?.message || 'Failed to update task';
        this.errorMessage.set(message);
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('Task deleted successfully');
          this.refreshTrigger.set(undefined); // إعادة جلب المهام
        },
        error: (err: unknown) => {
          const message = (err as any)?.error?.message || 'Failed to delete task';
          this.errorMessage.set(message);
        }
      });
    }
  }
}