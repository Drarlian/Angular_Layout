import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { ISigninResponse } from '../../interfaces/ISignin';
import { UsersService } from '../../services/users/users.service';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
  usersService = inject(UsersService);

  userData!: ISigninResponse | null;

  ngOnInit() {
      this.usersService.userInformations.subscribe((data) => {
        this.userData = data;
      })
  }
}
