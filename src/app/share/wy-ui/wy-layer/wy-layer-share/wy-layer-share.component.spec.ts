import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyLayerShareComponent } from './wy-layer-share.component';

describe('WyLayerShareComponent', () => {
  let component: WyLayerShareComponent;
  let fixture: ComponentFixture<WyLayerShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyLayerShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyLayerShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
