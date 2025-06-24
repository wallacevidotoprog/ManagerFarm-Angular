import { Routes } from '@angular/router';
import { PropertyFormComponent } from './pages/property-form/property-form.component';

export const routes: Routes = [
     { path: '**', redirectTo: 'property-form' },
    { path: 'property-form', component: PropertyFormComponent }
];
