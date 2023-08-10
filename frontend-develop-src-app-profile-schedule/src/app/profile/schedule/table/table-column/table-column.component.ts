import {Component, Input} from '@angular/core';
import {Master} from "../../../../core/entities/Master";
import {Appointment} from "../../../../core/entities/Appointment";
import * as moment from "moment/moment";
import {Observable} from "rxjs";

@Component({
  selector: 'schedule-column',
  templateUrl: './table-column.component.html',
  styleUrls: ['./table-column.component.scss']
})
export class TableColumnComponent {
  @Input() master!: Master;
  @Input('appointments') appointments$!: Observable<Appointment[]>;
  @Input() maxUnion!: moment.Moment[];

  trackByTime(index: number, time: moment.Moment): number {
    return time.valueOf();
  }
}
