import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {map} from "rxjs";
import {
  datePicked,
  pickDate
} from "./schedule.actions";


@Injectable()
export class ScheduleEffects {
  actions$: Actions = inject(Actions);

  pickDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pickDate),
      map(date => datePicked(date))
    )
  );
}
