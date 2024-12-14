import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RClavePage } from './r-clave.page';

describe('RClavePage', () => {
  let component: RClavePage;
  let fixture: ComponentFixture<RClavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RClavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
