import { Component, inject, input, OnInit, output, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TaskResponseDto } from "../dto/TaskResponseDto";
import { TaskRequestDto } from "../dto/TaskRequestDto";
import { ButtonComponent } from "./ButtonComponent";

@Component({
    selector: 'app-task-form',
    imports: [ReactiveFormsModule, ButtonComponent],
    template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div>
        <input formControlName="title" placeholder="Task Title" />
      </div>
      <div>
        <textarea formControlName="description" placeholder="Task Description"></textarea>
      </div>
      
      <app-button type="submit" [disabled]="taskForm.invalid">
        {{ isEditMode() ? 'save changes' : 'add task' }}
      </app-button>
    </form>
    `
})
export class TaskFormComponent implements OnInit{
    private fb = inject(FormBuilder);
    taskForm: FormGroup = this.fb.group({
        title: ["", Validators.required],
        description: [""],
    })
    formSubmit = output<TaskRequestDto>();
    initialData = input<TaskResponseDto | null>(null)
    isEditMode = signal(false);
    ngOnInit(){
        const data = this.initialData();
        if(data){
            this.isEditMode.set(true);
            this.taskForm.setValue({
                title: data.title,
                description: data.description,
            });
        }
    }
    onSubmit(){
        if (this.taskForm.valid)
        {
            this.formSubmit.emit(this.taskForm.value)
        }
    }
}