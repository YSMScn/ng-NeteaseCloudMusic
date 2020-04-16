import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { CentreComponent } from './centre/centre.component';
import { RecordsComponent } from './components/records/records.component';


@NgModule({
  declarations: [CentreComponent, RecordsComponent],
  imports: [
    ShareModule,
    MemberRoutingModule
  ]
})
export class MemberModule { }
