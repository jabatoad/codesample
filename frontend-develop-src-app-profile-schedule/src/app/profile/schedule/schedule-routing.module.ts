import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ScheduleComponent} from "./schedule.component";

const routes: Routes = [
  {path: '', component: ScheduleComponent},
  {path: ':position', component: ScheduleComponent},
  {path: ':position/:date', component: ScheduleComponent}, // Queries: 1)filter
  {path: ':position/:date/:noteID', component: ScheduleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule {
}
