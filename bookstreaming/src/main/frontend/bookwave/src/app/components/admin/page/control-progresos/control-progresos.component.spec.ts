import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlProgresosComponent } from './control-progresos.component';

describe('ControlProgresosComponent', () => {
  let component: ControlProgresosComponent;
  let fixture: ComponentFixture<ControlProgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlProgresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlProgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
