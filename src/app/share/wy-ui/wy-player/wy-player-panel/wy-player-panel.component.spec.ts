import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyPlayerPanelComponent } from './wy-player-panel.component';

describe('WyPlayerPanelComponent', () => {
  let component: WyPlayerPanelComponent;
  let fixture: ComponentFixture<WyPlayerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyPlayerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyPlayerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
