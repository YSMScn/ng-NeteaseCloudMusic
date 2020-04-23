import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyCheckCodeComponent } from './wy-check-code.component';

describe('WyCheckCodeComponent', () => {
  let component: WyCheckCodeComponent;
  let fixture: ComponentFixture<WyCheckCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyCheckCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyCheckCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
