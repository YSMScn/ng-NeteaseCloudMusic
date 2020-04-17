import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyLayerLikeComponent } from './wy-layer-like.component';

describe('WyLayerLikeComponent', () => {
  let component: WyLayerLikeComponent;
  let fixture: ComponentFixture<WyLayerLikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyLayerLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyLayerLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
