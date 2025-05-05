import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlUsuariosComponent } from './control-usuarios.component';

describe('ControlUsuariosComponent', () => {
  let component: ControlUsuariosComponent;
  let fixture: ComponentFixture<ControlUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
