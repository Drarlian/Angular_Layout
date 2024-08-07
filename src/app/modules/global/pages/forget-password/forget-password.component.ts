import { UsersService } from './../../services/users/users.service';
import { Component, OnInit, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [StepsModule, ButtonModule, CardModule, ReactiveFormsModule, FormsModule, InputTextModule, FloatLabelModule, CommonModule, LoadingComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
    usersServices = inject(UsersService);

    private router = inject(Router);
    messageService = inject(MessageService);

    isLoading: boolean = false;

    isInvalidEmail: boolean = false;

    isInvalidHash: boolean = false;

    isInvalidNewPassword: boolean = false;
    isInvalidPasswordConfirm: boolean = false;

    userForgetPasswordId: string = '';

    items: MenuItem[] | undefined;
    active: number = 0;

    forgetPasswordEmailForm!: FormGroup;
    forgetPasswordHashForm!: FormGroup;
    forgetPasswordNewPasswordForm!: FormGroup;


    ngOnInit() {
      this.items = [
        {
          label: 'Email',
        },
        {
          label: 'Código',
        },
        {
          label: 'Nova Senha',
        }
      ];

      this.forgetPasswordEmailForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
      })

      this.forgetPasswordHashForm = new FormGroup({
        hash: new FormControl('', [Validators.required]),
      })

      this.forgetPasswordNewPasswordForm = new FormGroup({
        newPassword: new FormControl('', [Validators.required]),
        passwordConfirm: new FormControl('', [Validators.required])
      })
    }

    navigateTo(route: string){
      this.router.navigate([route]);
    }

    async onSubmitEmail(){
      if (this.forgetPasswordEmailForm.value.email){
        this.isLoading = true;

        const validation = await this.usersServices.sendEmailForgetPassword(this.forgetPasswordEmailForm.value);

        this.isLoading = false;

        if (typeof(validation) == 'object'){
          this.active = 1
          this.userForgetPasswordId = `${validation?.id}`;
          this.isInvalidEmail = false;
        } else{
          this.isInvalidEmail = true;
        }
      } else{
        this.messageService.add({severity: 'error', summary: 'E-mail Vazio!', detail: 'Preencha todos os campos antes de continuar.'});
        this.isInvalidEmail = true;
      }
    }

    async onSubmitHashCode(){
      if (this.forgetPasswordHashForm.value.hash){
        this.isLoading = true;

        const validation = await this.usersServices.validateHashCode({hash: this.forgetPasswordHashForm.value.hash, userId: this.userForgetPasswordId});

        this.isLoading = false;

          if (validation){
            this.active = 2
            this.isInvalidHash = false;
          } else{
            this.isInvalidHash = true;
          }
      } else{
        this.messageService.add({severity: 'error', summary: 'Código Vazio!', detail: 'Preencha todos os campos antes de continuar.'});
        this.isInvalidHash = true;
      }
    }

    async onSubmitNewPassword(){
      if (this.forgetPasswordNewPasswordForm.value.newPassword && this.forgetPasswordNewPasswordForm.value.passwordConfirm && this.userForgetPasswordId){
        this.isLoading = true;

        const validation = await this.usersServices.editPasswordWithOutOldPassword({...this.forgetPasswordNewPasswordForm.value}, this.userForgetPasswordId);

        this.isLoading = false;

        if (validation){
          this.isInvalidNewPassword = false;
          this.isInvalidPasswordConfirm = false;
          this.navigateTo('signin');
        } else{
          this.isInvalidNewPassword = true;
          this.isInvalidPasswordConfirm = true;
        }
    } else{
      this.messageService.add({severity: 'error', summary: 'Dados Incompletos!', detail: 'Preencha todos os campos antes de continuar.'});
      this.isInvalidNewPassword = true;
      this.isInvalidPasswordConfirm = true;
      }
    }
}
