import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaListasComponent } from './vista-listas.component';

describe('VistaListasComponent', () => {
  let component: VistaListasComponent;
  let fixture: ComponentFixture<VistaListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaListasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
