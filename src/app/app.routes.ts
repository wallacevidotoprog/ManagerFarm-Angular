import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Role } from './Models/enum/auth.enum';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/pages/login/login.component';
import { RegisterComponent } from './pages/auth/pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ControlsComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { PecuariaComponent } from './pecuaria/pecuaria/pecuaria.component';
import { PropertyFormComponent } from './pages/property-form/property-form.component';

export const routes: Routes = [
  {
    path: 'controls',
    component: ControlsComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'team', component: TeamComponent },
      {
        path: 'livestock',
        component: PecuariaComponent,
        canActivate: [RoleGuard([Role.MANAGER])],
      },
      { path: 'property-form', component: PropertyFormComponent 
    // ,canActivate: [RoleGuard([Role.MANAGER])]:
  },
    ],
    canActivate: [AuthGuard],
  },

  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },

  { path: '**', redirectTo: 'controls' },
];
