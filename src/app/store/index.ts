import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './reducers/player.reducer';
import { StoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { memberReducer } from './reducers/member.reducer';



@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot({player:playerReducer,member:memberReducer},{
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge:20,
      logOnly:environment.production
    })
  ]
})
export class AppStoreModule { }
