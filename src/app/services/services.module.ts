import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { httpInterceptorProvides } from './http-interceptors';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    {provide: API_CONFIG, useValue: '/api/'},
    {provide: WINDOW,
      useFactory(plateformId: object): Window|object {
        return isPlatformBrowser(plateformId) ? window : {};
      },
    deps: [PLATFORM_ID]
    },
    httpInterceptorProvides
  ]
})
export class ServicesModule { }
