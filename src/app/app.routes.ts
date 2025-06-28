import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/pages/login/login.component';
import { RegisterComponent } from './pages/auth/pages/register/register.component';
import { PropertyFormComponent } from './pages/property-form/property-form.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },

  { path: 'property-form', component: PropertyFormComponent },
  // { path: '**', redirectTo: 'property-form' },
];
