import { HttpClient} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegisterRequestDto } from "../dto/RegisterRequestDto";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080"
    register(newacc: RegisterRequestDto): Observable<string>{
        return this.http.post<string>(`${this.link}/api/auth/register` , newacc)
    }
    
} 