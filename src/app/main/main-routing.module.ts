import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGurd } from '../auth/auth-gurd';

import { MainComponent } from './main.component';
import { MonthtasksComponent } from './monthtasks/monthtasks.component';
import { NewtaskformComponent } from './newtaskform/newtaskform.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  {path: '',
  component: MainComponent,
  canActivate: [AuthGurd],
  children: [
    {path: 'newtask', component: NewtaskformComponent},
    {path: 'toDayTasks', component: TasksComponent, children: [
      {path: 'task-list', component: TaskListComponent}
    ]},
    {path: 'monthtasks', component: MonthtasksComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
