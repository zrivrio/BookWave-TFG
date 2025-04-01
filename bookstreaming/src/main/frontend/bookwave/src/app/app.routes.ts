import { Routes } from '@angular/router';
import { HomeComponent } from './components/page/home/home.component';
import { CategoriesComponent } from './components/page/categories/categories.component';
import { LibraryComponent } from './components/page/library/library.component';
import { LoginComponent } from './components/page/login/login.component';
import { FavoritesComponent } from './components/page/favorites/favorites.component';
import { SettingsComponent } from './components/page/settings/settings.component';
import { HelpPComponent } from './components/page/help-p/help-p.component';
import { ProfileComponent } from './components/page/profile/profile.component';
import { SignupComponent } from './components/page/signup/signup.component';



export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'categories', component: CategoriesComponent },
    { path: 'library', component: LibraryComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'favorites', component: FavoritesComponent},
    { path: 'settings', component: SettingsComponent},
    { path: 'help', component: HelpPComponent},
    { path: 'profile', component: ProfileComponent},
    { path: '**', redirectTo: '' }
];
