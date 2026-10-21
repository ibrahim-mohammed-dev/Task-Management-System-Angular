import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TaskResponseDto } from "../dto/TaskResponseDto";
import { RestResponsePage } from "../dto/ResetResponsePage";

@Injectable({
    providedIn: 'root'
})
export class LoginService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080"
} 