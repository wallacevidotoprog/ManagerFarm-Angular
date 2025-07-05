import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent, RouterOutlet, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class ControlsComponent {}
