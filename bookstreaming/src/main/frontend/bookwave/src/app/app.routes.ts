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
import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';




export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'book/:id', component: BookDetailsComponent},
    { path: 'categories', component: CategoriesComponent },
    { path: 'library', component: LibraryComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'progress', component: ProgressComponent},
    { path: 'help', component: HelpPComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'profile/edit', component: EditProfileComponent},
    { path: '**', redirectTo: '' }
];
