import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WySearchComponent } from './wy-search.component';

describe('WySearchComponent', () => {
  let component: WySearchComponent;
  let fixture: ComponentFixture<WySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
