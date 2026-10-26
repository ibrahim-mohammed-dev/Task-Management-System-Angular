import { Component, inject, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PermissionService } from "../../../service/PermissionsService";
import { PermissionResponseDto } from "../../../dto/PermissionResponseDto";
@Component({
    selector: 'app-create-permission',
    imports: [ReactiveFormsModule],
    template:`
    <div class="form-card">
  <h3>Create New Permission</h3>
  
  <form [formGroup]="permissionGroup" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="permissionTitle">Permission Title</label>
      <input 
        id="permissionTitle" 
        type="text" 
        formControlName="title" 
        placeholder="Enter permission title..."
        [class.invalid]="permissionGroup.get('title')?.invalid && permissionGroup.get('title')?.touched"
      />
      
      @if (permissionGroup.get('title')?.invalid && permissionGroup.get('title')?.touched) {
        <small class="error-text">Permission title is required.</small>
      }
    </div>

    <button type="submit" class="btn-submit" [disabled]="permissionGroup.invalid">
      Create Permission
    </button>
  </form>
</div>
    `,
    styles: [`.form-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  max-width: 450px;
  margin: 0 auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1f2937;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}

.form-group input.invalid {
  border-color: #dc2626;
}

.form-group input.invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.error-text {
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-size: 0.8rem;
}

.btn-submit {
  width: 100%;
  background-color: #059669;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #047857;
}

.btn-submit:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}`]

})
export class CreatePermission{
    private permissionService = inject(PermissionService);
    formSubmit = output<PermissionResponseDto>();
    errorMessage = output<string>();
    permissionGroup: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required])
    });
    onSubmit() {
        if (this.permissionGroup.invalid) {
            this.permissionGroup.markAllAsTouched();
            return;
        }
        this.permissionService.addPermission(this.permissionGroup.value).subscribe({
            next: (newper) => {
                console.log("Group created successfully:", newper);
                this.formSubmit.emit(newper);
                this.permissionGroup.reset();
            },
            error: (err) => {
                console.error("Error creating group:", err);
                this.errorMessage.emit(err.error?.message || "An unexpected error occurred");
            }
        });
    }
}
