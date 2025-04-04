import { Component, OnInit, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonThemeComponent } from '../../components/button-theme/button-theme.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { UsersService } from '../../services/users/users.service';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CardModule, FormsModule, InputTextModule, FloatLabelModule, ButtonModule, CommonModule, ReactiveFormsModule, ToastModule, LoadingComponent, InputGroupModule, InputGroupAddonModule, ButtonThemeComponent, RippleModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {
  private router = inject(Router);
  usersServices = inject(UsersService);
  messageService = inject(MessageService);

  isLoading: boolean = false;

  loginForm!: FormGroup;

  isInvalid: boolean = false;

  visiblePassword: boolean = false;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  async onSubmit(){
    if (!this.loginForm.value.username || !this.loginForm.value.password){
      this.messageService.add({severity: 'error', summary: 'Informações Incompletas', detail: 'Preencha todos os campos antes de prosseguir.'});
    } else{
      this.isLoading = true;

      const response = await this.usersServices.signin(this.loginForm.value);

      this.isInvalid = true;
      this.isLoading = false;

      if (response) {
        this.isInvalid = false;
        this.router.navigate(['/home']);
      }
    }
  }

  navigateTo(route: string){
    this.router.navigate([route]);
  }

  togglePassword(){
    this.visiblePassword = !this.visiblePassword;
  }
}
