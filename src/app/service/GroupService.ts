import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GroupRequestDto } from "../dto/GroupRequestDto";
import { Observable } from "rxjs";
import { GroupResponseDto } from "../dto/GroupResponseDto";
import { RestResponsePage } from "../dto/ResetResponsePage";

@Injectable({
    providedIn: 'root'
})
export class GroupService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080/api/groups";

    createGroup(newTask: GroupRequestDto): Observable<GroupResponseDto>{
        return this.http.put<GroupResponseDto>(`${this.link}` , newTask);
    }
    assignUserToGroup(groupId: number, userId: number): Observable<GroupResponseDto>{
        return this.http.post<GroupResponseDto>(`${this.link}/${groupId}/users/${userId}`, null);
    }
    assignPermissionToGroup(groupId: number, permissionId: number): Observable<GroupResponseDto>{
        return this.http.post<GroupResponseDto>(`${this.link}/${groupId}/users/${permissionId}`, null);
    }
    deleteUserFromGroup(groupId: number, userId: number): Observable<any>{
        return this.http.delete(`${this.link}/${groupId}/users/${userId}`);
    }
    deletePermissionFromGroup(groupId: number, permissionId: number): Observable<any>{
        return this.http.delete(`${this.link}/${groupId}/users/${permissionId}`);
    }
    showAllGroups(page:number = 0 ,size:number= 10, sortBy: string = 'id',
        sortDir:string= 'asc' ):Observable<RestResponsePage<GroupResponseDto>>{
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDir', sortDir)
        return this.http.get<RestResponsePage<GroupResponseDto>>(`${this.link}/groups` , {params});
    }
}