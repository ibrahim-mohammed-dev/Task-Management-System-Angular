import { inject, Injectable } from "@angular/core";
import { PermissionRequestDto } from "../dto/PermissionRequestDto";
import { Observable } from "rxjs";
import { PermissionResponseDto } from "../dto/PermissionResponseDto";
import { HttpClient } from "@angular/common/http";

Injectable({
    providedIn: 'root'
})
export class PermissionService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080/api/groups";

    addPermission(newper: PermissionRequestDto): Observable<PermissionResponseDto>{
        return this.http.put<PermissionResponseDto>(`${this.link}/permissions` , newper); 
    }
}