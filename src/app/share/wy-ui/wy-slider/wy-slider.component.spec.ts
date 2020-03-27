import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WySliderComponent } from './wy-slider.component';

describe('WySliderComponent', () => {
  let component: WySliderComponent;
  let fixture: ComponentFixture<WySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WySliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
