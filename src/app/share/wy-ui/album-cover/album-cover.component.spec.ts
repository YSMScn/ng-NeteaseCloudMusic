import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCoverComponent } from './album-cover.component';

describe('AlbumCoverComponent', () => {
  let component: AlbumCoverComponent;
  let fixture: ComponentFixture<AlbumCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
