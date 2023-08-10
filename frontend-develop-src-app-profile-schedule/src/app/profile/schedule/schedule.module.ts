import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScheduleComponent} from './schedule.component';
import {ScheduleRoutingModule} from "./schedule-routing.module";
import {ProfileModule} from "../profile.module";
import {CreateBreakComponent} from '../modals/create-break/create-break.component';
import {AppointmentDetailsComponent} from '../modals/appointment-details/appointment-details.component';
import {CreateAppointmentComponent} from '../modals/create-appointment/create-appointment.component';
import {StoreModule} from "@ngrx/store";
import {SCHEDULE_FEATURE_KEY} from "./schedule.selectors";
import {scheduleReducer} from "./schedule.reducer";
import {EffectsModule} from "@ngrx/effects";
import {ScheduleEffects} from "./schedule.effects";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import { TableCellComponent } from './table/table-column/table-cell/table-cell.component';
import {ModalBtnDirective} from "../../core/directives/modal-btn.directive";
import {OuterClickDirective} from "../../core/directives/outer-click.directive";
import { TableComponent } from './table/table.component';
import { TableColumnComponent } from './table/table-column/table-column.component';
import {FilterByMasterPipe} from "../../core/pipes/appointments/filter-by-master.pipe";
import {FilterByMasterAndTimePipe} from "../../core/pipes/appointments/filter-by-master-and-time.pipe";
import {LettersOnlyDirective} from "../../core/directives/letters-only.directive";
import {ExcludeMasterPipe} from "../../core/pipes/masters/exclude-master.pipe";
import {DigitsOnlyDirective} from "../../core/directives/digits-only.directive";
import {ExcludeStatusPipe} from "../../core/pipes/statuses/exclude-status.pipe";
import {StatusSelectComponent} from "../../shared/layout/status-select/status-select.component";
import {SelectMenuComponent} from "../../shared/layout/select-menu/select-menu.component";
import {ExcludeTakenPipe} from "../../core/pipes/appointments/exclude-taken.pipe";
import {TableCellDirective} from "../../core/directives/table-cell.directive";
import {FilterByMasterAndTime$Pipe} from "../../core/pipes/appointments/filter-by-master-and-time$.pipe";
import {FilterByMaster$Pipe} from "../../core/pipes/appointments/filter-by-master$.pipe";
import {FilterMastersPipe} from "../../core/pipes/masters/filter.pipe";
import {FilterByIDPipe} from "../../core/pipes/masters/filter-by-id.pipe";
import {FilterBySpecialityPipe} from "../../core/pipes/masters/filter-by-speciality.pipe";
import {FilterByDatePipe} from "../../core/pipes/appointments/filter-by-date.pipe";
import {FilterByStatusPipe} from "../../core/pipes/appointments/filter-by-status.pipe";
import {FilterByGapPipe} from "../../core/pipes/favours/filter-by-gap.pipe";


@NgModule({
  declarations: [
    ScheduleComponent,
    CreateBreakComponent,
    AppointmentDetailsComponent,
    CreateAppointmentComponent,
    TableCellComponent,
    TableComponent,
    TableColumnComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    ProfileModule,
    StoreModule.forFeature(SCHEDULE_FEATURE_KEY, scheduleReducer),
    EffectsModule.forFeature([ScheduleEffects]),
    MatDatepickerModule,
    ReactiveFormsModule,
    CdkDrag,
    CdkDropListGroup,
    CdkDropList,
    CdkDragPlaceholder,
    ModalBtnDirective,
    OuterClickDirective,
    FilterByMasterPipe,
    FilterByMasterAndTimePipe,
    LettersOnlyDirective,
    ExcludeMasterPipe,
    DigitsOnlyDirective,
    ExcludeStatusPipe,
    StatusSelectComponent,
    SelectMenuComponent,
    ExcludeTakenPipe,
    TableCellDirective,
    FilterByMasterAndTime$Pipe,
    FilterByMaster$Pipe,
    FilterMastersPipe,
    FilterByIDPipe,
    FilterBySpecialityPipe,
    FilterByDatePipe,
    FilterByStatusPipe,
    FilterByGapPipe,
  ]
})
export class ScheduleModule { }
