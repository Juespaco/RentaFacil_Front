import { Component } from '@angular/core';
import { RouterOutlet ,  RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RentaFacil-WebApp';
}
