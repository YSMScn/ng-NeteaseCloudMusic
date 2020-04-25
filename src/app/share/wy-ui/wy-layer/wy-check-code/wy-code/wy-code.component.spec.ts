import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyCodeComponent } from './wy-code.component';

describe('WyCodeComponent', () => {
  let component: WyCodeComponent;
  let fixture: ComponentFixture<WyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
