import { Routes } from '@angular/router';
import { LoginComponent } from './component/loginComponent';
import { TaskComponent } from './component/Taskcomponent';
import { RegisterComponenet } from './component/RegisterComponent';
import { SingleTaskPage } from './component/SingleTaskPage';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'tasks',
        component: TaskComponent,
    },
    {
        path: 'register',
        component: RegisterComponenet,
    },
    {
        path: 'task/:id',
        component: SingleTaskPage,
    }
];