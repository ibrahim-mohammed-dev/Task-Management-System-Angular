import { Component, inject, input, output, computed } from "@angular/core";
import { GroupService } from "../../../service/GroupService";

type ActionType = 'assign-user' | 'assign-permission' | 'delete-user' | 'delete-permission';

@Component({
    selector: 'app-assign-delete',
    template: `
        <button (click)="onSubmit()">
            {{ buttonText() }}
        </button>
    `
})
export class AssignDeleteComponent {
    private groupService = inject(GroupService);

    groupId = input.required<number>();
    targetId = input.required<number>();
    mode = input.required<ActionType>();

    errorMessage = output<string>();
    successMessage = output<string>();

    buttonText = computed(() => {
        switch (this.mode()) {
            case 'assign-user': return 'Assign User';
            case 'assign-permission': return 'Assign Permission';
            case 'delete-user': return 'Delete User';
            case 'delete-permission': return 'Delete Permission';
        }
    });

    onSubmit() {
        const gId = this.groupId();
        const tId = this.targetId();

        switch (this.mode()) {
            case 'assign-user':
                this.groupService.assignUserToGroup(gId, tId).subscribe({
                    next: res => console.log(`User with id ${tId} assigned successfully`, res),
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to assign user")
                });
                break;

            case 'assign-permission':
                this.groupService.assignPermissionToGroup(gId, tId).subscribe({
                    next: res => console.log(`Permission with id ${tId} assigned successfully`, res),
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to assign permission")
                });
                break;

            case 'delete-user':
                this.groupService.deleteUserFromGroup(gId, tId).subscribe({
                    next: res => console.log(`User with id ${tId} deleted successfully`, res),
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to delete user")
                });
                break;

            case 'delete-permission':
                this.groupService.deletePermissionFromGroup(gId, tId).subscribe({
                    next: res => console.log(`Permission with id ${tId} deleted successfully`, res),
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to delete permission")
                });
                break;
        }
    }
}