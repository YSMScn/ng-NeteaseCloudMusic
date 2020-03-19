import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module';
import { PagesModule } from '../pages/pages.module';
import { ShareModule } from '../share/share.module';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    ShareModule,
    AppRoutingModule,
  ]
})
export class CoreModule {
  constructor(@SkipSelf()@Optional()parentModule:CoreModule){
    if(parentModule){
      throw new Error('CoreModule can be imported only by app module');
    }
    //Make sure this core module can be imported only by app module
    //@skipself() is used to avoid infinite loop
    //@optional() is usesd to avoid throw exception at the first time
    //For more information:https://www.cnblogs.com/starof/p/9069181.html
    
  }
 }
