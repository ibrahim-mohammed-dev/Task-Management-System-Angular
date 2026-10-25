import { Component, inject, output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PermissionService } from "../../../service/PermissionsService";
import { PermissionResponseDto } from "../../../dto/PermissionResponseDto";
@Component({
    selector: 'app-create-permission',
    template:`
    `

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
