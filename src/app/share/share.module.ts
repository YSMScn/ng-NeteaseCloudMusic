import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { WyUiModule } from './wy-ui/wy-ui.module';
import { ClickoutsideDirective } from './directives/clickoutside.directive';
//import { FormatTimePipe } from './pipes/format-time.pipe';



@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    WyUiModule
  ],
  exports:[
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    WyUiModule,
    ClickoutsideDirective
  ],
  // declarations: [ClickoutsideDirective],
  //declarations: [FormatTimePipe]
})
export class ShareModule { }
