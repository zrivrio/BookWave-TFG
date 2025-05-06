import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCategoriasComponent } from './control-categorias.component';

describe('ControlCategoriasComponent', () => {
  let component: ControlCategoriasComponent;
  let fixture: ComponentFixture<ControlCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlCategoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
