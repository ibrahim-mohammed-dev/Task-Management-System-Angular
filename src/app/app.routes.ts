import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./component/loginComponent').then((m) => m.LoginComponent),
    },
    {
        path: 'mytasks',
        loadComponent: () =>
            import('./component/Taskcomponent').then((m) => m.TaskComponent),
        
    },
    {
        path: 'register',
        loadComponent: ()=> import('./component/RegisterComponent').then((m)=> m.RegisterComponenet),
    },
    {
        path: 'task/:id',
        loadComponent: ()=> import('./component/SingleTaskPage').then((m)=>m.SingleTaskPage),
    },
    {
        path: 'groups',
        loadComponent: ()=> import('./featuers/groupPage/GroupPageComponent').then((m)=>m.GroupPageComponent),
    },
    {
        path:'alltasks',
        loadComponent: ()=> import('./component/TasksComponent').then((m)=>m.TasksComponent),
    },
    {
        path: 'allusers',
        loadComponent: ()=> import('./component/UsersComponent').then((m)=>m.UsersManagementComponent),
    },

];