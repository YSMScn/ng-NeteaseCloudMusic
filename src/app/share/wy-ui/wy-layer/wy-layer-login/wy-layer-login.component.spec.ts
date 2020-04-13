import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyLayerLoginComponent } from './wy-layer-login.component';

describe('WyLayerLoginComponent', () => {
  let component: WyLayerLoginComponent;
  let fixture: ComponentFixture<WyLayerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyLayerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyLayerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
