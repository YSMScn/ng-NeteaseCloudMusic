import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';

import { httpInterceptorProvides } from './http-interceptors';
import { environment } from 'src/environments/environment';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
// export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    {provide: API_CONFIG, useValue: environment.production ? '/' : '/api/' },
    // {provide: WINDOW,
    //   useFactory(plateformId: object): Window|object {
    //     return isPlatformBrowser(plateformId) ? window : {};
    //   },
    // deps: [PLATFORM_ID]
    // },
    httpInterceptorProvides
  ]
})
export class ServicesModule { }
