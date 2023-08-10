import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {concatMap, Observable, take, tap} from "rxjs";
import * as moment from "moment/moment";
import {Store} from "@ngrx/store";
import {BusinessState} from "../../../core/states/BusinessState";
import {Master} from "../../../core/entities/Master";
import {Appointment} from "../../../core/entities/Appointment";
import {ScheduleState} from "../../../core/states/ScheduleState";
import {map} from "rxjs/operators";
import {Speciality} from "../../../core/entities/Speciality";
import {selectCurrentDate, selectCurrentMasters, selectCurrentSpeciality} from "../schedule.selectors";

@Component({
  selector: 'schedule-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  @Input('masters') masters$: Observable<Master[]> = new Observable<Master[]>();
  @Input('appointments') appointments$: Observable<Appointment[]> = new Observable<Appointment[]>();
  @Input('selectedDate') selectedDate$: Observable<moment.Moment> = new Observable<moment.Moment>();

  maxUnion$: Observable<moment.Moment[]> = new Observable<moment.Moment[]>();
  currentSpeciality$: Observable<Speciality> = new Observable<Speciality>();
  currentMaster$: Observable<Master> = new Observable<Master>();
  currentDate$: Observable<moment.Moment> = new Observable<moment.Moment>();
  currentWeek: moment.Moment[] = [];

  scheduleStore: Store<ScheduleState> = inject(Store<ScheduleState>);

  ngOnInit() {
    this.appointments$.subscribe(() => {
      this.maxUnion$ = this.getMaxUnion(this.masters$.pipe(take(1)));
    })

    this.currentMaster$ = this.scheduleStore.select(selectCurrentMasters);
    this.currentSpeciality$ = this.scheduleStore.select(selectCurrentSpeciality);
    this.currentDate$ = this.scheduleStore.select(selectCurrentDate);

    this.currentDate$.subscribe(date => {
      const currentWeek: moment.Moment[] = [];
      const currentDate: moment.Moment = date.clone();
      const currentDay: number = currentDate.get('day');


      for (let i = 1; i < 8; i++) {
        currentWeek.push(currentDate.clone().add(i - currentDay, 'days'));
      }

      this.currentWeek = currentWeek;
    })
  }

  getMaxUnion(masters: Observable<Master[]>): Observable<moment.Moment[]> {
    const findUnion = (hours: number[]): number[] => Array.from(new Set([hours].flat()));

    return masters.pipe(
      concatMap(masters => {
        const timeArrays: number[] = [];
        masters.forEach(master => {
          const { start, end } = master.schedule.time;
          const range = [...Array(end - start + 1).keys()].map(x => x + start);
          timeArrays.push(...range);
        });

        const union: number[] = findUnion(timeArrays);

        return this.getMastersSchedule(union[0], union[union.length - 1]);
      })
    );
  }

  getMastersSchedule(startTime: number, endTime: number): Observable<moment.Moment[]> {
    return this.selectedDate$.pipe(
      map(selectedDate => {
        const timeArray: moment.Moment[] = [];
        const startMoment: moment.Moment = selectedDate.clone().hour(startTime).minute(0).second(0);
        const endMoment: moment.Moment = selectedDate.clone().hour(endTime).minute(0).second(0);

        let currentMoment: moment.Moment = startMoment.clone();
        while (currentMoment.isSameOrBefore(endMoment)) {
          timeArray.push(currentMoment.clone());
          currentMoment.add(30, 'minutes');
        }

        return timeArray;
      })
    );
  }
  addBreak(master: Master, currentDate: moment.Moment, $event: any): void {
    // this.addFilter('mode', this.scheduleModes.break, this.filterModes.REMOVE, $event);
    //
    // setTimeout(() => {
    //   this.addFilter('pickedTime', currentDate.valueOf().toString(), this.filterModes.REMOVE, $event);
    // }, 0)
    //
    // setTimeout(() => {
    //   this.addFilter('pickedMaster', master.id, this.filterModes.REMOVE, $event);
    // }, 0);
    //
    // this.scheduleStore.dispatch(openBreakModal());
  }

  onScroll($event: Event) {

  }
}
