import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPorfileComponent } from './edit-porfile.component';

describe('EditPorfileComponent', () => {
  let component: EditPorfileComponent;
  let fixture: ComponentFixture<EditPorfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPorfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPorfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
