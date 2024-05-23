import { Component, inject } from '@angular/core';
import { LayoutComponent } from '../global/components/layout/layout.component';
import { UsersService } from '../../services/users-service/users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  usersService = inject(UsersService)

  allMessage! : any

  ngOnInit() {
    // this.users.getAllMessages().subscribe((e: any) => this.allMessage = e)
  }
  
}
