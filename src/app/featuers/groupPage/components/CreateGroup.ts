import { Component, inject, output } from "@angular/core";
import { GroupService } from "../../../service/GroupService";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GroupResponseDto } from "../../../dto/GroupResponseDto";
@Component({
    selector: "app-create-group",
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
    <div class="form-card">
  <h3>Create New Group</h3>
  
  <form [formGroup]="groupGorm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="groupTitle">Group Title</label>
      <input 
        id="groupTitle" 
        type="text" 
        formControlName="title" 
        placeholder="Enter group title..."
        [class.invalid]="groupGorm.get('title')?.invalid && groupGorm.get('title')?.touched"
      />
      
      @if (groupGorm.get('title')?.invalid && groupGorm.get('title')?.touched) {
        <small class="error-text">Group title is required.</small>
      }
    </div>

    <button type="submit" class="btn-submit" [disabled]="groupGorm.invalid">
      Create Group
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
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
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
  background-color: #4f46e5;
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
  background-color: #4338ca;
}

.btn-submit:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}`]
})
export class CreateGroup {
    private groupService = inject(GroupService);
    formSubmit = output<GroupResponseDto>();
    errorMessage = output<string>();
    groupGorm: FormGroup = new FormGroup({
        title: new FormControl('', [Validators.required])
    });
    onSubmit() {
        if (this.groupGorm.invalid) {
            this.groupGorm.markAllAsTouched();
            return;
        }
        this.groupService.createGroup(this.groupGorm.value).subscribe({
            next: (newGroup) => {
                console.log("Group created successfully:", newGroup);
                this.formSubmit.emit(newGroup);
                this.groupGorm.reset();
            },
            error: (err) => {
                console.error("Error creating group:", err);
                this.errorMessage.emit(err.error?.message || "An unexpected error occurred");
            }
        });
    }
}