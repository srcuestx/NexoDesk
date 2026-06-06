import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianDashboardPage } from './technician-dashboard.page';

describe('TechnicianDashboardPage', () => {
  let component: TechnicianDashboardPage;
  let fixture: ComponentFixture<TechnicianDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
