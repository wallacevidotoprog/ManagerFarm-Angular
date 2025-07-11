import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Role } from '../../Models/enum/auth.enum';
import { hasRole } from '../../../api/Utils/hasRoles';
import { getLocal, localStorageData } from '../../../api/Utils/hasLocal';
import { IProperty } from '../../../api/internal/model/property.interface';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    RouterLink,
    MatToolbarModule,
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent  {  
  protected Role = Role;
  protected hasRole = hasRole;
  protected property= getLocal<IProperty>('PROPERTY')


  
}
