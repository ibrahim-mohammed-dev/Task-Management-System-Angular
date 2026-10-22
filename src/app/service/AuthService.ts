import { HttpClient} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegisterRequestDto } from "../dto/RegisterRequestDto";
import { LoginResponseDto } from "../dto/LoginResponseDto";
import { LoginRequestDto } from "../dto/LoginRequestDto";
import { RefreshTokenRequestDto } from "../dto/RefreshTokenRequestDto";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);
    private link: string = "http://localhost:8080"
    register(newacc: RegisterRequestDto): Observable<string>{
        return this.http.post(`${this.link}/api/auth/register` , newacc , { responseType: 'text' })
    }
    login(acc: LoginRequestDto): Observable<LoginResponseDto>{
        return this.http.post<LoginResponseDto>(`${this.link}/api/auth/login` , acc);
    }
    refreshToken(dto: RefreshTokenRequestDto): Observable<LoginResponseDto>{
        return this.http.post<LoginResponseDto>(`${this.link}/api/auth/refresh` ,dto);
    }
    logout(): Observable<string> {
    return this.http.post(`${this.link}/api/auth/logout`, null, { responseType: 'text' });
    }
}