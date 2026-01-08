import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { ISigninData } from '../../interfaces/ISignin';
import { UsersService } from '../../services/users/users.service';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
  usersService = inject(UsersService);

  userData!: ISigninData | null;

  ngOnInit() {
      this.usersService.user$.subscribe((data) => {
        this.userData = data;
      })
  }
}
