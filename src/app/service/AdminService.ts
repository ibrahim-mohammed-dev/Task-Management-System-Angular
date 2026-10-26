import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RestResponsePage } from "../dto/ResetResponsePage";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UserResponseDto } from "../dto/UserResponseDto";
import { TaskResponseDto } from "../dto/TaskResponseDto";

@Injectable({
    providedIn: 'root'
})
export class AdminService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080/api/admin";

    showAllUsers(page:number = 0 ,size:number= 10, sortBy: string = 'id',
        sortDir:string= 'asc' ):Observable<RestResponsePage<UserResponseDto>>{
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDir', sortDir)
        return this.http.get<RestResponsePage<UserResponseDto>>(`${this.link}/users` , {params});
    }
    searchUsers(query: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.link}/users/search`, { params });
  }
    showallTasks(page:number = 0 ,size:number= 10, sortBy: string = 'id',
            sortDir:string= 'asc' ): Observable<RestResponsePage<TaskResponseDto>>{
                const params = new HttpParams()
                .set('page', page.toString())
                .set('size', size.toString())
                .set('sortBy', sortBy)
                .set('sortDir', sortDir)
            return this.http.get<RestResponsePage<TaskResponseDto>>(`${this.link}/tasks` , { params });
        }
    deleteTask(id:number): Observable<any>{
        return this.http.delete(`${this.link}/tasks/${id}`);
    }
}