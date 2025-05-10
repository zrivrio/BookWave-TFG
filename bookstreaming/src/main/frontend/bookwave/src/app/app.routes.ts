import { Routes } from '@angular/router';
import { HomeComponent } from './components/user/page/home/home.component';
import { BookDetailsComponent } from './components/user/page/book-details/book-details.component';
import { CategoriesComponent } from './components/user/page/categories/categories.component';
import { LibraryComponent } from './components/user/page/library/library.component';
import { LoginComponent } from './components/user/page/login/login.component';
import { SignupComponent } from './components/user/page/signup/signup.component';
import { ProgressComponent } from './components/user/page/progress/progress.component';
import { HelpPComponent } from './components/user/page/help-p/help-p.component';
import { ProfileComponent } from './components/user/page/profile/profile.component';
import { EditProfileComponent } from './components/user/page/edit-profile/edit-profile.component';
import { CheckoutComponent } from './components/user/page/checkout/checkout.component';
import { PanelControlComponent } from './components/admin/panel-control/panel-control.component';
import { ControlUsuariosComponent } from './components/admin/control-usuarios/control-usuarios.component';
import { ControlLibrosComponent } from './components/admin/control-libros/control-libros.component';
import { ControlProgresosComponent } from './components/admin/control-progresos/control-progresos.component';
import { ControlCategoriasComponent } from './components/admin/control-categorias/control-categorias.component';
import { ControlCarritoComponent } from './components/admin/control-carrito/control-carrito.component';
import { ControlListasComponent } from './components/admin/control-listas/control-listas.component';
import { ControlReviewsComponent } from './components/admin/control-reviews/control-reviews.component';

export const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent,
        canActivate: [() => {
            if (typeof localStorage !== 'undefined') {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user && user.role === 'Admin') {
                    window.location.href = '/admin/dashboard';
                    return false;
                }
            }
            return true;
            }
            return true;
        }]
    },
    { path: 'book/:id', component: BookDetailsComponent },
    { path: 'categories', component: CategoriesComponent},
    { path: 'library', component: LibraryComponent},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'progress', component: ProgressComponent},
    { path: 'help', component: HelpPComponent },
    { path: 'profile', component: ProfileComponent},
    { path: 'profile/edit', component: EditProfileComponent},
    { path: 'checkout', component: CheckoutComponent},
    // Rutas de administrador
    { 
        path: 'admin', 
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: PanelControlComponent },
            { path: 'users', component: ControlUsuariosComponent },
            { path: 'books', component: ControlLibrosComponent },
            { path: 'lists', component: ControlListasComponent },
            { path: 'progress', component: ControlProgresosComponent },
            { path: 'categories', component: ControlCategoriasComponent },
            { path: 'carts', component: ControlCarritoComponent },
            { path: 'reviews', component: ControlReviewsComponent  }
        ]
    },
    { 
        path: '**', 
        component: HomeComponent,
        canActivate: [() => {
            if (typeof localStorage!== 'undefined') {
                const userStr = localStorage.getItem('currentUser');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user && user.role === 'Admin') {
                        window.location.href = '/admin/dashboard';
                        return false;
                    }
                }
                return true;
            }
            return true;
        }]
    }
];
