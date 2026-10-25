import { Component, inject, output } from "@angular/core";
import { GroupService } from "../../../service/GroupService";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GroupResponseDto } from "../../../dto/GroupResponseDto";
@Component({
    selector: "app-create-group",
    template: `
    
    `
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