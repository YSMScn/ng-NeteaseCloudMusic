import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { CentreComponent } from './centre/centre.component';
import { RecordsComponent } from './components/records/records.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';


@NgModule({
  declarations: [CentreComponent, RecordsComponent, RecordDetailComponent],
  imports: [
    ShareModule,
    MemberRoutingModule
  ]
})
export class MemberModule { }
