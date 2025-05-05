import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlReportsComponent } from './control-reports.component';

describe('ControlReportsComponent', () => {
  let component: ControlReportsComponent;
  let fixture: ComponentFixture<ControlReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
