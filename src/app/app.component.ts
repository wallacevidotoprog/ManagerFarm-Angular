import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [RouterOutlet, ToastrModule],
=======
  imports: [RouterOutlet,ToastrModule ],
>>>>>>> 551242e8fb94e164cda533d03333f8a8400fc802
  standalone: true,
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'Maneger Farm Angular';
}
