import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, of } from "rxjs";
import { RestResponsePage } from "../dto/ResetResponsePage";
import { TaskResponseDto } from "../dto/TaskResponseDto";
import { TaskService } from "../service/TaskService";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TaskRequestDto } from "../dto/TaskRequestDto";
import { TaskFormComponent } from "../shared/TaskFormComponent";

@Component({
    selector: 'app-task-list',
    imports: [TaskFormComponent],
    template: `
    <app-task-form (formSubmit)="onsubmit($event)" />
    `,
})
export class TaskComponent {
  private taskService = inject(TaskService); 
  private addedTask?: TaskResponseDto;
  errorMessage= signal<string>('');
  onsubmit(task: TaskRequestDto){
    this.taskService.addTask(task).subscribe({
      next: (data) => {
        this.addedTask = data;
        console.log("new task added =", data);
      },
      error: (err) => {
        const meassage = err.error.message;
        this.errorMessage.set(meassage);
      }
    })
  }
  tasks = toSignal(
    this.taskService.getTasks().pipe(
      catchError((error) => {
        console.error("Error fetching tasks", error);
        return of({ content: [], 
          totalElements: 0, 
          totalPages: 0, 
          size: 10, 
          number: 0 } as RestResponsePage<TaskResponseDto>);
      })
    ),
    { initialValue: { content: [], 
          totalElements: 0, 
          totalPages: 0, 
          size: 10, 
          number: 0 } as RestResponsePage<TaskResponseDto> }
  );
}