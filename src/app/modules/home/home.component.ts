import { Component } from '@angular/core';
import { LayoutComponent } from '../global/components/layout/layout.component';
import { UsersServiceService } from '../global/services/users-service/users-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor (private users: UsersServiceService) {}

  allMessage! : any

  ngOnInit() {
    this.users.getAllMessages().subscribe((e: any) => this.allMessage = e)
  }
  
}
