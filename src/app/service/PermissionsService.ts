import { inject, Injectable } from "@angular/core";
import { PermissionRequestDto } from "../dto/PermissionRequestDto";
import { Observable } from "rxjs";
import { PermissionResponseDto } from "../dto/PermissionResponseDto";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RestResponsePage } from "../dto/ResetResponsePage";

@Injectable({
    providedIn: 'root'
})
export class PermissionService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080/api/groups";

    addPermission(newper: PermissionRequestDto): Observable<PermissionResponseDto>{
        return this.http.put<PermissionResponseDto>(`${this.link}/permissions` , newper); 
    }
    showAllPermissions(page:number = 0 ,size:number= 10, sortBy: string = 'id',
        sortDir:string= 'asc' ):Observable<RestResponsePage<PermissionResponseDto>>{
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDir', sortDir)
        return this.http.get<RestResponsePage<PermissionResponseDto>>(`${this.link}/permissions` , {params});
    }
}