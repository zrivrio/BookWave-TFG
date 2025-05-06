import { Component } from '@angular/core';

import { VistaUsuariosComponent } from '../../panel-control/vista-usuarios/vista-usuarios.component';
import { VistaCarritoComponent } from '../../panel-control/vista-carrito/vista-carrito.component';
import { VistaCategoriasComponent } from '../../panel-control/vista-categorias/vista-categorias.component';
import { VistaLibrosComponent } from '../../panel-control/vista-libros/vista-libros.component';
import { VistaListasComponent } from '../../panel-control/vista-listas/vista-listas.component';
import { VistaProgresosComponent } from '../../panel-control/vista-progresos/vista-progresos.component';
import { VistaReportesComponent } from '../../panel-control/vista-reportes/vista-reportes.component';
import { VistaReviewsComponent } from '../../panel-control/vista-reviews/vista-reviews.component';

@Component({
  selector: 'app-panel-control',
  imports: [VistaUsuariosComponent, VistaCarritoComponent, VistaCategoriasComponent, VistaLibrosComponent, VistaListasComponent, VistaProgresosComponent, VistaReportesComponent, VistaReviewsComponent],
  templateUrl: './panel-control.component.html',
  styleUrl: './panel-control.component.css'
})
export class PanelControlComponent {

}
