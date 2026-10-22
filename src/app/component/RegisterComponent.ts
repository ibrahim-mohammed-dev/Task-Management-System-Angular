import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../service/AuthService";
import { RegisterRequestDto } from "../dto/RegisterRequestDto";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule],
        template:`
    <div class="auth-container">
        <div class="auth-card">
            <h2>Create Account</h2>
            <form [formGroup]="registerForm" (ngSubmit)="register()">
            @if (errorMessage()) {
                <div class="error-banner">{{ errorMessage() }}</div>
            }
            @if (successMessage()) {
                <div class="success-banner">{{ successMessage() }}</div>
            }

            <div class="form-group">
                <label for="username">Username</label>
                <input id="username" formControlName="username" type="text" placeholder="Choose a username" />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" formControlName="email" type="email" placeholder="Enter your email" />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" formControlName="password" type="password" placeholder="Choose a password" />
            </div>

            <button type="submit" class="btn-primary" [disabled]="registerForm.invalid">Register</button>
            </form>
        </div>
    </div>
    `,
    styleUrl: '../componentstyles/RegisterComponent.css'
})

export class RegisterComponenet{
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    errorMessage= signal<string>('');
    successMessage= signal<string>('');
    registerForm: FormGroup = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(6) , Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8) ,Validators.maxLength(40)]],
    });
    register():void{
        if(this.registerForm.valid){
            const requestData = this.registerForm.getRawValue() as RegisterRequestDto;
            this.authService.register(requestData).subscribe({
            next: response =>  {this.errorMessage.set('');
                this.successMessage.set(response);
                console.log('Registration successful:', response)
                this.router.navigate(['/login']);
            },
            error: (err) => {this.errorMessage.set(err.error?.message || err.error || "failed to register")},
        });                 
        }else{
            this.registerForm.markAllAsTouched();
        }
        
    }
}