import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaReviewsComponent } from './vista-reviews.component';

describe('VistaReviewsComponent', () => {
  let component: VistaReviewsComponent;
  let fixture: ComponentFixture<VistaReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
