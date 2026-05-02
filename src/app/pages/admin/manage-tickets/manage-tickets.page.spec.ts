import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageTicketsPage } from './manage-tickets.page';

describe('ManageTicketsPage', () => {
  let component: ManageTicketsPage;
  let fixture: ComponentFixture<ManageTicketsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
