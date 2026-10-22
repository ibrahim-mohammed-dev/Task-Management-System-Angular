import { Component, inject, signal } from "@angular/core";
import { TaskService } from "../service/TaskService";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { rxResource } from "@angular/core/rxjs-interop";
@Component({
    selector: 'app-one-task',
    imports: [RouterLink],
    template: `
    <div class="task-detail-container">
        @if (taskResource.isLoading()) {
            <div class="state-message">Loading task details...</div>
        } @else if (taskResource.error(); as err) {
            <div class="state-message error">There is no task with ID: {{ taskid }}</div>
        } @else if (taskResource.value(); as task) {
            <div class="task-card-detail">
            <span class="task-id">ID: {{ task.id }}</span>
            <h2>{{ task.title }}</h2>
            <p class="task-desc">{{ task.description }}</p>
            <div class="task-status" [class.completed]="task.completed">
                Status: {{ task.completed ? 'Completed' : 'Pending' }}
            </div>
            </div>
        }
        <div class="back-action">
            <button routerLink="/tasks" class="btn-secondary">Back to tasks</button>
        </div>
    </div>
    `,
    styleUrl: '../componentstyles/SingleTaskPage.css'
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