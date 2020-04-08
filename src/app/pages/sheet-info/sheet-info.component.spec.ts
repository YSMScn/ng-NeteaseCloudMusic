import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInfoComponent } from './sheet-info.component';

describe('SheetInfoComponent', () => {
  let component: SheetInfoComponent;
  let fixture: ComponentFixture<SheetInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
