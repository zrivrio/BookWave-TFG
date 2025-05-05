import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLibrosComponent } from './control-libros.component';

describe('ControlLibrosComponent', () => {
  let component: ControlLibrosComponent;
  let fixture: ComponentFixture<ControlLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlLibrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
