import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlReviewsComponent } from './control-reviews.component';

describe('ControlReviewsComponent', () => {
  let component: ControlReviewsComponent;
  let fixture: ComponentFixture<ControlReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
