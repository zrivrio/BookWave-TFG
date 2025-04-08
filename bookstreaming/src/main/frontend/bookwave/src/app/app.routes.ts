import { Routes } from '@angular/router';
import { HomeComponent } from './components/page/home/home.component';
import { CategoriesComponent } from './components/page/categories/categories.component';
import { LibraryComponent } from './components/page/library/library.component';
import { LoginComponent } from './components/page/login/login.component';
import { SettingsComponent } from './components/page/settings/settings.component';
import { HelpPComponent } from './components/page/help-p/help-p.component';
import { ProfileComponent } from './components/page/profile/profile.component';
import { SignupComponent } from './components/page/signup/signup.component';
import { BookDetailsComponent } from './components/page/book-details/book-details.component';
import { ProgressComponent } from './components/page/progress/progress.component';



export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'book/:id', component: BookDetailsComponent},
    { path: 'categories', component: CategoriesComponent },
    { path: 'library', component: LibraryComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'progress', component: ProgressComponent},
    { path: 'settings', component: SettingsComponent},
    { path: 'help', component: HelpPComponent},
    { path: 'profile', component: ProfileComponent},
    { path: '**', redirectTo: '' }
];
