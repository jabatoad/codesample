import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Master} from "../../core/entities/Master";
import {Store} from "@ngrx/store";
import {ScheduleState} from "../../core/states/ScheduleState";
import {
  selectAcceptedAppointments,
  selectCellStatuses,
  selectCurrentDate, selectCurrentMasters, selectCurrentSpeciality, selectEditingModalState,
  selectFailedAppointments,
  selectFinishedAppointments,
  selectVerifiedAppointments
} from "./schedule.selectors";
import {
  openBreakModal,
  openCreationModal,
  openEditingModal,
  pickDate, setCurrentMaster, setCurrentSpeciality
} from "./schedule.actions";
import * as moment from "moment/moment";
import {FilterModes} from "../../core/enums/FilterModes";
import {ScheduleModes} from "../../core/enums/ScheduleModes";
import {Appointment} from "../../core/entities/Appointment";
import {AppointmentStatuses} from "../../core/enums/AppointmentStatuses";
import {Speciality} from "../../core/entities/Speciality";
import {FormControl, FormGroup} from "@angular/forms";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {DateRange, extendMoment, MomentRange} from "moment-range";
import {
  BehaviorSubject, combineLatest, concatMap,
  distinct,
  filter,
  from,
  mergeMap,
  Observable,scan,
  switchMap,
  take, tap,
  toArray
} from "rxjs";
import {map} from "rxjs/operators";
import {AppointmentStatus} from "../../core/entities/AppointmentStatus";
import {AppState} from "../../core/states/AppState";
import {setCurrentPage} from "../../app.actions";
import {BusinessState} from "../../core/states/BusinessState";
import {editAppointment, loadAppointments, loadMasters} from "../business.actions";
import {selectLoadedAppointments, selectLoadedMasters} from "../business.selectors";
import {selectAllStatuses} from "../tasks/tasks.selectors";
import {TasksState} from "../../core/states/TasksState";

const Moment = require('moment');

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @ViewChild('timeScroll') timeScroll: ElementRef = new ElementRef<any>({});
  @ViewChild('table') table: ElementRef = new ElementRef<any>({});

  @ViewChild('specialitiesMenuBtn') specialitiesMenuBtn: ElementRef = {} as ElementRef;
  @ViewChild('mastersMenuBtn') mastersMenuBtn: ElementRef = {} as ElementRef;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.specialitiesMenuBtn?.nativeElement.contains(event.target)) {
      this.specialitiesMenuOpen = false;
    }
    if (!this.mastersMenuBtn?.nativeElement.contains(event.target)) {
      this.mastersMenuOpen = false;
    }
  }
  protected readonly AppointmentsStatuses = AppointmentStatuses;

  appointmentDetailsOpen$: Observable<boolean> = new Observable<boolean>();
  maxUnion: Observable<moment.Moment[]> = new Observable<moment.Moment[]>();
  selectedDate$: Observable<moment.Moment> = new Observable<moment.Moment>();
  statusesCount: any = {};
  masters$: Observable<Master[]> = new Observable<Master[]>();
  appointments$: Observable<Appointment[]> = new Observable<Appointment[]>();
  mastersMenuOpen: boolean = false;
  specialitiesMenuOpen: boolean = false;
  todayAppointments: BehaviorSubject<Appointment[]> = new BehaviorSubject<Appointment[]>([]);
  momentRange: MomentRange = extendMoment(Moment);
  cellStatuses$: Observable<{[key: string]: AppointmentStatus}[]> = new Observable<{[key: string]: AppointmentStatus}[]>();
  statuses$: Observable<AppointmentStatus[]> = new Observable<AppointmentStatus[]>();

  currentSpeciality: Speciality = {} as Speciality;
  currentMaster: Master = {} as Master;

  cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  appStore: Store<AppState> = inject(Store<AppState>);
  scheduleStore: Store<ScheduleState> = inject(Store<ScheduleState>);
  businessStore: Store<BusinessState> = inject(Store<BusinessState>);
  tasksStore: Store<TasksState> = inject(Store<TasksState>);

  filtersForm: FormGroup = new FormGroup<any>({
    specialityControl: new FormControl<Speciality>({} as Speciality),
    masterControl: new FormControl<Master>({} as Master),
  });


  constructor() {
    this.appStore.dispatch(setCurrentPage({name: 'schedule'}));

    this.scheduleStore.select(selectCurrentSpeciality).subscribe(speciality => {
      this.filtersForm.get('specialityControl')?.setValue(speciality);
    });

    this.scheduleStore.select(selectCurrentMasters).subscribe(master => {
      this.filtersForm.get('masterControl')?.setValue(master);
    });
    // this.scheduleStore.dispatch(pickDate({date: moment(queryParams['tableTime'])}));
  }

  ngOnInit() {
    this.appointmentDetailsOpen$ = this.scheduleStore.select(selectEditingModalState);

    this.businessStore.dispatch(loadAppointments({date: moment()}));
    this.businessStore.dispatch(loadMasters());

    this.masters$ = this.businessStore.select(selectLoadedMasters);
    this.appointments$ = this.businessStore.select(selectLoadedAppointments);
    this.selectedDate$ = this.scheduleStore.select(selectCurrentDate);

    this.cellStatuses$ = this.scheduleStore.select(selectCellStatuses);
    this.statuses$ = this.tasksStore.select(selectAllStatuses);

    this.selectedDate$.subscribe(date => {
      this.businessStore.dispatch(loadAppointments({date}));

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {'tableTime': date},
        queryParamsHandling: 'merge',
      });
    })

    this.appointments$.subscribe(apps => {
      console.log(apps);
    })

    this.businessStore.select(selectLoadedAppointments).subscribe(val => {
      this.todayAppointments.next(val);
    });
    this.businessStore.select(selectLoadedAppointments).subscribe(appointments => {
      this.scheduleStore.select(selectAcceptedAppointments).subscribe(val => {
        this.statusesCount[AppointmentStatuses.ACCEPTED] = val.length;
      });

      this.scheduleStore.select(selectVerifiedAppointments).subscribe(val => {
        this.statusesCount[AppointmentStatuses.VERIFIED] = val.length;
      });

      this.scheduleStore.select(selectFinishedAppointments).subscribe(val => {
        this.statusesCount[AppointmentStatuses.FINISHED] = val.length;
      });

      this.scheduleStore.select(selectFailedAppointments).subscribe(val => {
        this.statusesCount[AppointmentStatuses.FAILED] = val.length;
      });

      this.cd.detectChanges();
    });
    this.maxUnion = this.getMaxUnion();
  }

  getMaxUnion(): Observable<moment.Moment[]> {
    const findUnion = (hours: number[]): number[] => Array.from(new Set([hours].flat()));

    return this.masters$.pipe(
      take(1),
      tap(() => console.log('tap')),
      switchMap(masters => {
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

  pickDate(date: moment.Moment | null): void {
    if(date) {
      this.scheduleStore.dispatch(pickDate({date}));
    }
  }

  previousDay(): void {
    this.selectedDate$
      .pipe(
        take(1),
        map(date => date.clone()),
        map(clonedDate => clonedDate.subtract(1, 'days'))
      )
      .subscribe(date => {
        this.scheduleStore.dispatch(pickDate({date}));
      })
  }

  nextDay(): void {
    this.selectedDate$
      .pipe(
        take(1),
        map(date => date.clone()),
        map(clonedDate => clonedDate.add(1, 'days'))
      )
      .subscribe(date => {
        this.scheduleStore.dispatch(pickDate({date}));
      })
  }

  todayDate(): void {
    this.scheduleStore.dispatch(pickDate({date: moment()}));
  }

  pickMaster(master: Master): void {
    this.scheduleStore.dispatch(setCurrentMaster({master}));
  }

  pickSpeciality(speciality: Speciality): void {
    this.scheduleStore.dispatch(setCurrentSpeciality({speciality}));
  }

  getSpecialities(): Observable<Speciality[]> {
    return this.masters$.pipe(
      take(1),
      mergeMap(masters => masters),
      mergeMap(master => from(master.specialities)),
      distinct(speciality => speciality.id),
      scan((acc: Speciality[], speciality: Speciality) => [...acc, speciality], [])
    );
  }

  editTime(appID: string, newTime: moment.Moment): void {
    const oldApp$: Observable<Appointment | undefined> = this.todayAppointments.pipe(
      take(1),
      map(apps => apps.find(app => app.id === appID))
    );
    oldApp$.subscribe(oldApp => {
      if(oldApp) {
        const newEndTime: moment.Moment = oldApp.endTime.clone().subtract(oldApp.startTime.diff(newTime));
        const newApp: Appointment = {...oldApp, startTime: newTime, endTime: newEndTime};

        this.businessStore.dispatch(editAppointment({appointment: newApp}));
      }
    })
  }

  resetFilters(): void {
    this.scheduleStore.dispatch(setCurrentMaster({master: {} as Master}));
    this.scheduleStore.dispatch(setCurrentSpeciality({speciality: {} as Speciality}));
  }
}
