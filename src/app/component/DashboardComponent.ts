import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-dashboard',
    template:`
    
    `
})
export class DashboardComponent{
    private router = inject(Router);
    onMyTasks(){
        this.router.navigate(['mytasks']);
    }
    onGroups(){
        this.router.navigate(['groups']);
    }
    onTasks(){
        this.router.navigate(['alltasks']);
    }
    onUsers(){
        this.router.navigate(['allusers'])
    }

}