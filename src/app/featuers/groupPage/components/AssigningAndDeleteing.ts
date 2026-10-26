import { Component, inject, input, output, computed } from "@angular/core";
import { GroupService } from "../../../service/GroupService";

type ActionType = 'assign-user' | 'assign-permission' | 'delete-user' | 'delete-permission';

@Component({
    selector: 'app-assign-delete',
    template: `
        <button 
    type="button" 
    [class]="mode().includes('delete') ? 'btn-danger' : 'btn-primary'" 
    (click)="onSubmit()">
    {{ buttonText() }}
    </button>
    `,
    styles: [`
    button {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, box-shadow 0.2s;
    }

    /* تنسيق أزرار الإضافة (Assign) */
    .btn-primary {
    background-color: #4f46e5;
    color: #ffffff;
    }

    .btn-primary:hover {
    background-color: #4338ca;
    }

    .btn-primary:active {
    background-color: #3730a3;
    }

    /* تنسيق أزرار الحذف (Delete) */
    .btn-danger {
    background-color: #fee2e2;
    color: #dc2626;
    }

    .btn-danger:hover {
    background-color: #fecaca;
    }

    .btn-danger:active {
    background-color: #fca5a5;
    }
`]
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
                    next: res => {
                        console.log(`User with id ${tId} assigned successfully`, res);
                        this.successMessage.emit(`User with id ${tId} has been assigned successfully!`);
                    },
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to assign user")
                });
                break;

            case 'assign-permission':
                this.groupService.assignPermissionToGroup(gId, tId).subscribe({
                    next: res => {
                        console.log(`Permission with id ${tId} assigned successfully`, res);
                        this.successMessage.emit(`Permission with id ${tId} has been assigned successfully!`);
                    },
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to assign permission")
                });
                break;

            case 'delete-user':
                this.groupService.deleteUserFromGroup(gId, tId).subscribe({
                    next: res => {
                        console.log(`User with id ${tId} deleted successfully`, res);
                        this.successMessage.emit(`User with id ${tId} has been deleted successfully!`);
                    },
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to delete user")
                });
                break;

            case 'delete-permission':
                this.groupService.deletePermissionFromGroup(gId, tId).subscribe({
                    next: res => {
                        console.log(`Permission with id ${tId} deleted successfully`, res);
                        this.successMessage.emit(`Permission with id ${tId} has been deleted successfully!`);
                    },
                    error: err => this.errorMessage.emit(err.error?.message || "Failed to delete permission")
                });
                break;
        }
    }
}