import { Component } from '@angular/core';
import { LayoutComponent } from '../global/components/layout/layout.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
