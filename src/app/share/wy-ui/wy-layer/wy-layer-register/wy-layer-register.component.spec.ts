import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyLayerRegisterComponent } from './wy-layer-register.component';

describe('WyLayerRegisterComponent', () => {
  let component: WyLayerRegisterComponent;
  let fixture: ComponentFixture<WyLayerRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyLayerRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyLayerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
