import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ScheduleState} from "../../core/states/ScheduleState";
import {AppointmentStatuses} from "../../core/enums/AppointmentStatuses";
import * as moment from "moment";

export const SCHEDULE_FEATURE_KEY = 'schedule';

export const selectScheduleState = createFeatureSelector<ScheduleState>(SCHEDULE_FEATURE_KEY);

export const selectCurrentMasters = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.currentMaster
);

export const selectCurrentSpeciality = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.currentSpeciality
);

export const selectMasterById = (masterId: string) => createSelector(
  selectScheduleState,
  (state) => state.masters.find(master => master.id === masterId)
);

export const selectCreationModalState = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.creationModal
);

export const selectEditingModalState = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.editingModal
);

export const selectEditingModalChanges = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.editingModalChanges
);

export const selectBreakModalState = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.breakModal
);

export const selectNamesOfSpecialities = (masterId: string) => createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.masters.find(master => master.id === masterId)?.specialities.map(speciality => speciality.name)
);

export const selectCurrentDate = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.date
);

export const selectAppointment = (time: moment.Moment, $masterID: string) => createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.appointments.filter(app => app.masterID === $masterID).find(app => app.startTime.isSame(time)),
);

export const selectAppointmentByID = ($appID: string) => createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.appointments.find(app => app.id === $appID),
);

export const selectAcceptedAppointments = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.appointments.filter(appointment => appointment.status.className === AppointmentStatuses.ACCEPTED)
);

export const selectFinishedAppointments = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.appointments.filter(appointment => appointment.status.className === AppointmentStatuses.FINISHED)
);

export const selectVerifiedAppointments = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.appointments.filter(appointment => appointment.status.className === AppointmentStatuses.VERIFIED)
);

export const selectFailedAppointments = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.appointments.filter(appointment => appointment.status.className === AppointmentStatuses.FAILED)
);

export const selectEditingModalTime = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.editingModalTime
);

export const selectCellStatuses = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.cellStatuses
);

export const selectModalMasterID = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.modalMasterID
);

export const selectModalAppointmentID = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.modalAppointmentID
);

export const selectModalTime = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.modalTime
);

export const selectTablePace = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.tablePace
)
