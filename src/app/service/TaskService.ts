import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {  Observable } from "rxjs";
import { TaskResponseDto } from "../dto/TaskResponseDto";
import { RestResponsePage } from "../dto/ResetResponsePage";
import { TaskRequestDto } from "../dto/TaskRequestDto"

@Injectable({
    providedIn: 'root'
})
export class TaskService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080"

    getTasks(page:number = 0 ,size:number= 10, sortBy: string = 'id',
        sortDir:string= 'asc' ): Observable<RestResponsePage<TaskResponseDto>>{
            const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDir', sortDir)
        return this.http.get<RestResponsePage<TaskResponseDto>>(`${this.link}/api/tasks` , { params });
    }
    addTask(newTask: TaskRequestDto): Observable<TaskResponseDto>{
        return this.http.post<TaskResponseDto>(`${this.link}/api/tasks`, newTask);
    }
    getTaskById(id:number):Observable<TaskResponseDto>{
        return this.http.get<TaskResponseDto>(`${this.link}/api/tasks/${id}`)
    }
    updateTask(id:number , updatedTask: TaskRequestDto): Observable<TaskResponseDto>{
        return this.http.put<TaskResponseDto>(`${this.link}/api/tasks/${id}` , updatedTask); 
    }
    deleteTask(id:number): Observable<any>{
        return this.http.delete(`${this.link}/api/tasks/${id}`);
    }
    changeTaskState(id:number): Observable<TaskResponseDto>{
        return this.http.patch<TaskResponseDto>(`${this.link}/api/tasks/${id}/toggle`, id)
    }
} 