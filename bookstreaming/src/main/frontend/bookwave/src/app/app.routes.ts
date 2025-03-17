import { Routes } from '@angular/router';
import { HomeComponent } from './components/page/home/home.component';
import { CategoriesComponent } from './components/page/categories/categories.component';
import { LibraryComponent } from './components/page/library/library.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'library', component: LibraryComponent}
];
