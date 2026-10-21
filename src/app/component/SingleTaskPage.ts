import { Component, inject, signal } from "@angular/core";
import { TaskService } from "../service/TaskService";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { rxResource } from "@angular/core/rxjs-interop";
@Component({
    selector: 'app-one-task',
    imports: [RouterLink],
    template: `
    @if(taskResource.isLoading()){
    <p>waiting</p>
    }@else if (taskResource.error(); as err) {
        <p>there is no task with id: {{taskid}}</p>
    }
     @else if (taskResource.value(); as task) {
        
    {{task.id}}
    {{task.title}}
    {{task.description}}
    {{task.completed}}
    }
    <button routerLink="tasks">Back to tasks</button>
    `
})
export class SingleTaskPage{
    private taskService = inject(TaskService);
    private route = inject(ActivatedRoute);
    taskid = Number(this.route.snapshot.paramMap.get('id'));
    taskResource = rxResource({
    params: () => ({ id: this.taskid }),
    stream: ({ params }) => this.taskService.getTaskById(params.id)
    }); 
}