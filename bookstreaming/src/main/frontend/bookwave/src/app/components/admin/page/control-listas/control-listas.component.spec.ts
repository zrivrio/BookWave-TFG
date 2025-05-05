import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlListasComponent } from './control-listas.component';

describe('ControlListasComponent', () => {
  let component: ControlListasComponent;
  let fixture: ComponentFixture<ControlListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlListasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
