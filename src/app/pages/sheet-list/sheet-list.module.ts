import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SheetListRoutingModule } from './sheet-list-routing.module';
import { SheetListComponent } from './sheet-list.component';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [SheetListComponent],
  imports: [
    SheetListRoutingModule,
    ShareModule
  ]
})
export class SheetListModule { }
