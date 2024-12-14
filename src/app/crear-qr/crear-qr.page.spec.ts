import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearQrPage } from './crear-qr.page';

describe('CrearQrPage', () => {
  let component: CrearQrPage;
  let fixture: ComponentFixture<CrearQrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
