import { Component, inject, signal } from "@angular/core";
import { LoginService } from "../service/LoginService";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, of } from "rxjs";
import { RestResponsePage } from "../dto/ResetResponsePage";
import { TaskResponseDto } from "../dto/TaskResponseDto";
import { TaskService } from "../service/TaskService";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TaskRequestDto } from "../dto/TaskRequestDto";

@Component({
    selector: 'app-task-list',
    imports:[],
    template: `
    @for (task of tasks().content; track task.id) {
        {{task.title}}
        {{task.description}}
        {{task.completed}}
    }
    `,
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  taskForm: FormGroup = this.fb.group({
    title: ['' ,Validators.required],
    description: ['']
  }) 
  private addedTask?: TaskResponseDto;
  errorMessage= signal<string>('');
  onsubmit(){
    if(this.taskForm.invalid){ return ;}
    this.taskService.addTask(this.taskForm.getRawValue()).subscribe({
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
