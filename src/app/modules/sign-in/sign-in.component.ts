import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users-service/users.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  usersService = inject(UsersService);
  router = inject(Router);

  username: string = '';
  password: string = '';

  async signIn(){
    const status = await this.usersService.signIn({username: this.username, password: this.password})
    if (status){
      console.log('sucesso')
      this.router.navigate(['/home']);
    } else{
      console.log('fracasso')
    }
  }
}
