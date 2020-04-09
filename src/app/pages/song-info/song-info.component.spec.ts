import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongInfoComponent } from './song-info.component';

describe('SongInfoComponent', () => {
  let component: SongInfoComponent;
  let fixture: ComponentFixture<SongInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
