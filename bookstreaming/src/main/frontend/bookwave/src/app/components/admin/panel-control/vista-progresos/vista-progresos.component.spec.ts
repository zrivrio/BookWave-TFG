import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaProgresosComponent } from './vista-progresos.component';

describe('VistaProgresosComponent', () => {
  let component: VistaProgresosComponent;
  let fixture: ComponentFixture<VistaProgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaProgresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaProgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
