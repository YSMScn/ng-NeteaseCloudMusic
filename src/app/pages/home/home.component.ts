import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/services/data-types/common-types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;
  constructor(private homeServe:HomeService) {
    this.homeServe.getBanners().subscribe(banners => {
      this.banners =banners;
    });
   }

  ngOnInit(): void {
  }

  beforeChange({to}){
    this.carouselActiveIndex = to;
  }

  onChangeSlide(direction:'pre' | 'next'){
    this.nzCarousel[direction]();
  }
}
