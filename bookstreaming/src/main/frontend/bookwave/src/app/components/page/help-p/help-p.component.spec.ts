import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPComponent } from './help-p.component';

describe('HelpPComponent', () => {
  let component: HelpPComponent;
  let fixture: ComponentFixture<HelpPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
