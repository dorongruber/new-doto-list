import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TasksComponent } from './tasks/tasks.component';
import { NewtaskformComponent } from './newtaskform/newtaskform.component';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskItemComponent } from './tasks/task-list/task-item/task-item.component';
import { MonthtasksComponent } from './monthtasks/monthtasks.component';
import { HighlightDayDirective } from './highlight-day.directive';
import { DaycalendarComponent } from './calendar/daycalendar/daycalendar.component';
import { MonthcalendarComponent } from './calendar/monthcalendar/monthcalendar.component';
import { CarditemComponent } from './tasks/task-list/task-item/carditem/carditem.component';
import { PanelitemComponent } from './tasks/task-list/task-item/panelitem/panelitem.component';
import { PositionDirective } from './tasks/task-list/task-item/position.directive';

import { ImgExifService, ImgMaxPXSizeService, ImgMaxSizeService, Ng2ImgMaxService, Ng2ImgMaxModule } from 'ng2-img-max';

@NgModule({
  declarations: [
    MainComponent,
    CalendarComponent,
    TasksComponent,
    NewtaskformComponent,
    TaskListComponent,
    TaskItemComponent,
    MonthtasksComponent,
    HighlightDayDirective,
    DaycalendarComponent,
    MonthcalendarComponent,
    CarditemComponent,
    PanelitemComponent,
    PositionDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatRadioModule,
    MainRoutingModule,
    Ng2ImgMaxModule,
    SharedModule
  ],
  providers: [
    ImgMaxPXSizeService,
    ImgExifService,
    ImgMaxSizeService,
    Ng2ImgMaxService,
  ],
  exports: []
})
export class MainModule {}
