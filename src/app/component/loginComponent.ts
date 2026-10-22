import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../service/AuthService";
import { maxLength } from "@angular/forms/signals";
import { RegisterRequestDto } from "../dto/RegisterRequestDto";
import { LoginRequestDto } from "../dto/LoginRequestDto";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule],
    template:`
    <div class="auth-container">
    <div class="auth-card">
        <h2>Welcome Back</h2>
        <form [formGroup]="loginForm" (ngSubmit)="login()">
        @if (errorMessage()) {
            <div class="error-banner">{{ errorMessage() }}</div>
        }
        
        <div class="form-group">
            <label for="username">Username</label>
            <input id="username" formControlName="username" type="text" placeholder="Enter your username" />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input id="password" formControlName="password" type="password" placeholder="Enter your password" />
        </div>

        <button type="submit" class="btn-primary" [disabled]="loginForm.invalid">Login</button>
        </form>
        </div>
    </div>
    `,
    styleUrl: '../componentstyles/LoginComponent.css'
})
export class LoginComponent{
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router)
    errorMessage= signal<string>('');
    loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
});

    login():void{
        if(this.loginForm.valid){
            const loginacc = this.loginForm.getRawValue() as LoginRequestDto
            this.authService.login(loginacc).subscribe({
            next: response => {
                this.errorMessage.set('');
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
                localStorage.setItem('tokenType', response.type);
                this.router.navigate(['/tasks']);
            },
            error: err => this.errorMessage.set(err.error?.message || err.error || 'failed to login')
        })
        }else{ this.loginForm.markAllAsTouched();}
    }
}