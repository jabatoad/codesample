import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter, inject,
  Input, OnInit,
  Output
} from '@angular/core';
import * as moment from "moment/moment";
import {defaultIfEmpty, filter, Observable, take} from "rxjs";
import {Appointment} from "../../../../../core/entities/Appointment";
import {Store} from "@ngrx/store";
import {ScheduleState} from "../../../../../core/states/ScheduleState";
import {map} from "rxjs/operators";
import {FilterModes} from "../../../../../core/enums/FilterModes";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Client} from "../../../../../core/entities/Client";
import {UsersService} from "../../../../../core/services/users.service";
import {AppointmentStatus} from "../../../../../core/entities/AppointmentStatus";
import {BusinessState} from "../../../../../core/states/BusinessState";
import {selectTablePace} from "../../../schedule.selectors";
import {CdkDragDrop, CdkDragEnd} from "@angular/cdk/drag-drop";
import produce from "immer";
import {editAppointment} from "../../../../business.actions";

@Component({
  selector: 'schedule-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCellComponent implements OnInit {
  @Input() time: moment.Moment = moment();
  @Input() masterID: string = '';
  @Input('appointment') appointment$!: Observable<Appointment | undefined>;
  @Output() cellState: EventEmitter<AppointmentStatus> = new EventEmitter<AppointmentStatus>();

  client$: Observable<Client | undefined> = new Observable<Client | undefined>();
  tablePace$: Observable<number> = new Observable<number>();

  cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  scheduleStore: Store<ScheduleState> = inject(Store<ScheduleState>);
  businessStore: Store<BusinessState> = inject(Store<BusinessState>);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  usersService: UsersService = inject(UsersService);

  ngOnInit() {
    this.appointment$
      .subscribe(appointment => {
        if(appointment) {
          console.log('[Table cell] new app');
          this.client$ = this.getClientNameByAppointment(appointment.clientID);
        }
      })
    this.tablePace$ = this.scheduleStore.select(selectTablePace);
    this.cd.detectChanges();
  }

  getClientByID(clientID: string): Observable<Client | undefined> {
    return this.usersService.getClient(clientID);
  }

  getClientNameByAppointment(id: string): Observable<Client | undefined> {
    return this.getClientByID(id).pipe(
      filter(client => client !== null),
      map(client => client as Client),
      defaultIfEmpty(undefined),
    )
  }

  addFilter(paramName: string, filter: string, mode: FilterModes = FilterModes.REMOVE, $event?: any): void {
    if($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    let queryParams: Params = {};
    const existingParam: string = this.route.snapshot.queryParams[paramName];

    switch (mode) {
      case FilterModes.SUBSTITUTE: {
        if(existingParam === filter) {
          queryParams[paramName] = undefined;
        } else {
          queryParams[paramName] = filter;
        }
        break;
      }
      case FilterModes.REMOVE: {
        if(!existingParam) {
          queryParams[paramName] = filter;
        } else {
          queryParams[paramName] = undefined;
        }
        break;
      }
      case FilterModes.CHAIN_REMOVE: {
        let filters: string[] = [];

        if (existingParam) {
          let replacedParam: string = '';

          if(existingParam.includes(filter)) {
            replacedParam = existingParam.replace(filter, '');
            filters = replacedParam.split(',').filter(f => f.trim() !== '');
          } else {
            filters = existingParam.split(',').filter(f => f.trim() !== '');
            filters.push(filter);
          }
        } else {
          filters.push(filter);
        }

        if(filters.length === 0) {
          queryParams[paramName] = undefined;
        } else {
          queryParams = { [paramName]: filters.join(',') };
        }
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onDrag($event: CdkDragDrop<any>): void {
    const newStart: moment.Moment = $event.container.data['time'];
    const currentTime: moment.Moment = $event.item.data['appointment'].startTime;
    if(newStart.isSame(currentTime)) {
      return;
    } else {
      const appointment: Appointment = $event.item.data['appointment'];
      const timeDifference: number = appointment.endTime.clone().diff(appointment.startTime.clone(), 'minute');
      const newEnd: moment.Moment = newStart.clone().add(timeDifference, 'minute');

      const newAppointment: Appointment = produce(appointment, draft => {
        draft.startTime = newStart;
        draft.endTime = newEnd;
      });

      this.businessStore.dispatch(editAppointment({appointment: newAppointment}));
    }
  }

  onDrop($event: CdkDragEnd<any>): void {
    console.log($event);
    // this.client$ = this.getClientNameByAppointment(this.appointment.clientID);
  }
}
