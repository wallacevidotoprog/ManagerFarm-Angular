import { Component } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [SidenavComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
