import {createReducer, on} from '@ngrx/store';
import {ScheduleState} from "../../core/states/ScheduleState";
import * as moment from "moment/moment";
import {
  addCellStatus,
  cancelEditingModalChanges,
  closeBreakModal,
  closeCreationModal, closeEditingModal, datePicked, detectEditingModalChanges, editTime,
  openBreakModal,
  openCreationModal, openEditingModal, setCurrentMaster, setCurrentSpeciality, setTablePace
} from "./schedule.actions";
import produce from "immer";
import {Master} from "../../core/entities/Master";
import {Speciality} from "../../core/entities/Speciality";

const initialState: ScheduleState = {
  appointments: [],
  date: moment(),
  masters: [],
  creationModal: false,
  breakModal: false,
  editingModal: false,
  editingModalChanges: false,
  editingModalTime: {
    start: moment(),
    end: moment(),
  },
  cellStatuses: [],
  currentMaster: {} as Master,
  currentSpeciality: {} as Speciality,
  modalTime: moment(),
  modalAppointmentID: '',
  modalMasterID: '',
  tablePace: 30
  // filterMasters: [],
  // filterSpecialities: [],
  // filterAppointments: [],
  // filterStatuses: [],
};

export const scheduleReducer = createReducer(
  initialState,
  on(setCurrentMaster, (state, { master }) =>
    produce(state, draftState => {
      draftState.currentMaster = master;
    })
  ),
  on(setCurrentSpeciality, (state, { speciality }) =>
    produce(state, draftState => {
      draftState.currentSpeciality = speciality;
    })
  ),
  on(openCreationModal, (state, props) =>
    produce(state, draftState => {
      draftState.modalTime = props.time;
      draftState.modalMasterID = props.masterID;
      draftState.creationModal = true;
    })
  ),
  on(setTablePace, (state, {minutes}) =>
    produce(state, draftState => {
      draftState.tablePace = minutes;
    })
  ),
  on(closeCreationModal, (state) => ({
    ...state,
    creationModal: false,
  })),
  on(openEditingModal, (state, {appointmentID}) =>
    produce(state, draftState => {
      draftState.modalAppointmentID = appointmentID;
      draftState.editingModal = true;
    })
  ),
  on(closeEditingModal, (state) => ({
    ...state,
    editingModal: false,
  })),
  on(detectEditingModalChanges, (state) => ({
    ...state,
    editingModalChanges: true,
  })),
  on(cancelEditingModalChanges, (state) => ({
    ...state,
    editingModalChanges: false,
  })),
  on(openBreakModal, (state) => ({
    ...state,
    breakModal: true,
  })),
  on(closeBreakModal, (state) => ({
    ...state,
    breakModal: false,
  })),
  on(datePicked, (state, {date}) => ({
    ...state,
    date,
  })),
  on(editTime, (state, {time}) => ({
    ...state,
    editingModalTime: time,
  })),
  on(addCellStatus, (state, {cellStatus}) => ({
    ...state,
    cellStatuses: [...state.cellStatuses, cellStatus]
  })),
);
