import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCarritoComponent } from './control-carrito.component';

describe('ControlCarritoComponent', () => {
  let component: ControlCarritoComponent;
  let fixture: ComponentFixture<ControlCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlCarritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
