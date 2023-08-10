import {createAction, props} from '@ngrx/store';
import * as moment from 'moment/moment'
import {Master} from "../../core/entities/Master";
import {Badge} from "../../core/entities/Badge";
import {AppointmentStatus} from "../../core/entities/AppointmentStatus";
import {Speciality} from "../../core/entities/Speciality";


export const pickDate = createAction(
  '[Schedule] Pick Date',
  props<{date: moment.Moment}>()
);

export const datePicked = createAction(
  '[Schedule] Date Picked',
  props<{date: moment.Moment}>()
);

export const pickMaster = createAction(
  '[Schedule] Pick Master',
  props<{master: Master}>()
);

export const masterPicked = createAction(
  '[Schedule] Master Picked',
);

export const chooseBadge = createAction(
  '[Schedule] Choose Badge',
  props<{badge: Badge}>()
);

export const openCreationModal = createAction(
  '[Schedule] Open Creation Modal',
  props<{time: moment.Moment, masterID: string}>()
);

export const closeCreationModal = createAction(
  '[Schedule] Close Creation Modal',
);

export const openEditingModal = createAction(
  '[Schedule] Open Editing Modal',
  props<{appointmentID: string}>()
);

export const closeEditingModal = createAction(
  '[Schedule] Close Editing Modal',
);

export const detectEditingModalChanges = createAction(
  '[Schedule] Detect Editing Modal Changes',
);

export const cancelEditingModalChanges = createAction(
  '[Schedule] Cancel Editing Modal Changes',
);

export const openBreakModal = createAction(
  '[Schedule] Open Break Modal',
);

export const closeBreakModal = createAction(
  '[Schedule] Close Break Modal',
);

export const editTime = createAction(
  '[Schedule] Edit Time',
  props<{time: {start: moment.Moment, end: moment.Moment}}>()
)

export const addCellStatus = createAction(
  '[Schedule] Edit Appointment',
  props<{cellStatus: {[key: string]: AppointmentStatus}}>()
)

export const setCurrentMaster = createAction(
  '[Schedule] Set Current Master',
  props<{master: Master}>()
)

export const setCurrentSpeciality = createAction(
  '[Schedule] Set Current Speciality',
  props<{speciality: Speciality}>()
)

export const setTablePace = createAction(
  '[Schedule] Set Table Pace',
  props<{minutes: number}>()
)

