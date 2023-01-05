import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivvyHeatMapValetComponent } from './divvy-heat-map-valet.component';

describe('DivvyHeatMapValetComponent', () => {
  let component: DivvyHeatMapValetComponent;
  let fixture: ComponentFixture<DivvyHeatMapValetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivvyHeatMapValetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivvyHeatMapValetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
