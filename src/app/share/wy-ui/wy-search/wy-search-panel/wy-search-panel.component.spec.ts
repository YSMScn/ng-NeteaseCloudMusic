import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WySearchPanelComponent } from './wy-search-panel.component';

describe('WySearchPanelComponent', () => {
  let component: WySearchPanelComponent;
  let fixture: ComponentFixture<WySearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WySearchPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WySearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
