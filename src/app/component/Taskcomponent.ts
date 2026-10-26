import { Component, inject, OnInit, signal } from "@angular/core";
import { TaskResponseDto } from "../dto/TaskResponseDto";
import { TaskService } from "../service/TaskService";
import { TaskRequestDto } from "../dto/TaskRequestDto";
import { TaskFormComponent } from "../shared/TaskFormComponent";
import { rxResource } from "@angular/core/rxjs-interop";

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
      @if (tasksResource.isLoading()) {
      <div class="loading-state" style="text-align: center; padding: 3rem;">
        <div class="spinner"></div> 
        <p>Loading tasks, please wait...</p>
      </div>
    }
    @else {
      <div class="tasks-grid">
        @for (task of tasks().content; track task.id) {
          <div class="task-card" [class.completed]="task.completed">
            <div class="task-info">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
            </div>
            <div class="task-actions">
              
              <button class="btn-update" (click)="openUpdateModal(task)">Update</button>
              <button class="btn-delete" (click)="deleteTask(task.id)">Delete</button>
              <label class="completed-label"> 
              <input type="checkbox" class="btn-completed" [checked]="task.completed" (change)="changeCompleted(task.id)" >
               {{task.completed===true ? "Completed": "complete"}}</label>
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
      <div class="pagination-controls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
        <button 
          class="btn-primary" 
          (click)="prevPage()" 
          [disabled]="currentPage() === 0">
          Previous
        </button>

        <span>Page {{ currentPage() + 1 }} of {{ tasks().totalPages || 1 }}</span>

        <button 
          class="btn-primary" 
          (click)="nextPage()" 
          [disabled]="currentPage() >= tasks().totalPages - 1">
          Next
        </button>
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

  currentPage = signal<number>(0); 
  pageSize = signal<number>(10);   

  tasksResource = rxResource({
    params: () => ({ page: this.currentPage(), size: this.pageSize() }),
    stream: ({ params }) => {
      return this.taskService.getTasks(params.page, params.size);
    },
    defaultValue: { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0 }
  });
  tasks = this.tasksResource.value;

  nextPage(): void {
    const total = this.tasks().totalPages;
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

  onAddSubmit(task: TaskRequestDto): void {
    this.taskService.addTask(task).subscribe({
      next: (res) => {
        this.closeAddModal();
        this.tasksResource.reload();
        console.log("task added succssesfully" ,res)
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to add task');
      }
    });
  }

  onUpdateSubmit(task: TaskRequestDto): void {
    const currentTask = this.selectedTask();
    if (!currentTask) return;

    this.taskService.updateTask(currentTask.id, task).subscribe({
      next: (res) => {
        this.closeUpdateModal();
        this.tasksResource.update(page => {
          if (!page) return page;
          return {
            ...page,
            content: page.content.map(t => t.id === currentTask.id ? res : t)
          };
        });
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to update task');
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasksResource.reload();
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Failed to delete task');
        }
      });
    }
  }

  changeCompleted(id: number): void {
    this.taskService.changeTaskState(id).subscribe({
      next: (res) => {
        this.tasksResource.update(page => {
          if (!page) return page;
          return {
            ...page,
            content: page.content.map(t => t.id === id ? res : t)
          };
        });
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to update task state');
      }
    });
  }

  openAddModal(): void { this.errorMessage.set(''); this.isAddModalOpen.set(true); }
  closeAddModal(): void { this.isAddModalOpen.set(false); }
  openUpdateModal(task: TaskResponseDto): void { this.errorMessage.set(''); this.selectedTask.set(task); this.isUpdateModalOpen.set(true); }
  closeUpdateModal(): void { this.selectedTask.set(null); this.isUpdateModalOpen.set(false); }
}