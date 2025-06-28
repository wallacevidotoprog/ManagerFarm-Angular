import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgToastComponent } from 'ng-angular-popup';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastrModule ],
  standalone: true,
  template: `<router-outlet>`,
  // templateUrl: './app.component.html',
  // styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Maneger Farm Angular';
}
