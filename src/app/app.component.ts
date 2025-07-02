import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastrModule],
  standalone: true,
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'Maneger Farm Angular';
}
