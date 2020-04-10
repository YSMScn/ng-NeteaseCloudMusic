import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { ShareModule } from '../../share.module';
import { NgZorroAntdModule, NzInputModule, NzIconModule } from 'ng-zorro-antd';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { OverlayModule} from '@angular/cdk/overlay';



@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  entryComponents:[WySearchPanelComponent],
  imports: [
    CommonModule,
    NzInputModule,
    NzIconModule,
    OverlayModule
  ],
  exports:[WySearchComponent]
})
export class WySearchModule { }
