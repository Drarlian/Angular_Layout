import { inject, Injectable } from '@angular/core';
import { ISigninData, ISigninRequest, ISigninResponse } from '../../interfaces/ISignin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { StorageService } from '../local-storage/storage.service';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../interfaces/IUser';
import { Router } from '@angular/router';

const mockUser: ISigninData = {
  user: {
    accessId: 1,
    email: 'renato@teste.com.br',
    username: 'renato.tester',
    firstName: 'Renato',
    lastName: 'Tester',
    active: true,
    roles: ['ADMIN']
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private localStorageService = inject(StorageService);
  private router = inject(Router);

  endpoint: string = '';

  private userSubject = new BehaviorSubject<ISigninData | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() { }

  getTokenAuthorization() {
    const token = '';

    return new HttpHeaders({
      'Content-type':  'application/json',
      'Authorization' : `Bearer ${token}`
    })
  }

  get currentUser(): any | null {
    return this.userSubject.value;
  }

  async rehydrateSession() {
    const response = await this.getUserData();
    return response;
  }
  
  getUserData() {
    return new Promise<boolean>((resolve, _) => {
      this.http.get<any>(`${this.endpoint}/me`, { withCredentials: true }).subscribe({
        next: (data) => {
          this.userSubject.next(data.data);
          resolve(true);
        }, error: (error: any) => {
          resolve(false);
        }
      })
    })
  }

  signin(data: ISigninRequest){
    // Temp Login:
    if (data.username == 'admin' && data.password == 'admin'){
      this.userSubject.next(mockUser)
      this.localStorageService.setLocalStorage('USER-BASIC-TEMPLATE', mockUser, false, false);
      return true
    }

    return new Promise<boolean>((resolve, _) => {this.http.post<ISigninResponse>(`${this.endpoint}/login`, data, { withCredentials: true }).subscribe({
      next: (data) => {
        this.userSubject.next(data.data);
        resolve(true);
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao realizar o login!', detail: error.error.detail })
        resolve(false);
      }
    })})
  }

  logout() {
    return new Promise<boolean>((resolve, _) => {this.http.post(`${this.endpoint}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: (_) => {
        this.userSubject.next(null);
        this.router.navigate(["/signin"]);
        resolve(true);
      }, error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Login Inválido', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  findAllUsers(){
    return new Promise<IUser[] | []>((resolve, _) => {this.http.get<IUser[]>(`${this.endpoint}`, { withCredentials: true }).subscribe({
      next: (data) => {
        if (data){
          resolve(data);
        } else{
          resolve([]);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao procurar pelos usuários!', detail: error.error.detail});
        resolve([]);
      }
    })});
  }

  findOneUser(userId: number){
    return new Promise<IUser | null>((resolve, _) => {this.http.get<IUser>(`${this.endpoint}/${userId}`, { withCredentials: true }).subscribe({
      next: (data) => {
        if (data){
          resolve(data);
        } else{
          resolve(null);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao procurar pelo ususuário!', detail: error.error.detail});
        resolve(null);
      }
    })});
  }

  editUserAdmin(userId: number, data: any){
    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(`${this.endpoint}/${userId}`, data, { withCredentials: true }).subscribe({
      next: (data) => {
        if (data){
          this.messageService.add({severity: 'success', summary: 'Dados Alterados!', detail: 'As informações foram alteradas com sucesso.'});
          resolve(true);
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro Interno!', detail: 'Houve um erro interno ao alterar as informações.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar os Dados!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  async editUserAuto(data: any){
    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(`${this.endpoint}`, data, { withCredentials: true }).subscribe({
      next: async (data) => {
        if (data){
          const response = await this.rehydrateSession();
          if (typeof(response) == 'object'){
            this.userSubject.next(response);
            this.messageService.add({severity: 'success', summary: 'Dados Alterados!', detail: 'As informações foram alteradas com sucesso.'});
            resolve(true);
          } else {
            this.messageService.add({severity: 'error', summary: 'Erro Interno!', detail: 'Houve um erro interno ao alterar as informações.'});
            resolve(false);
          }
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro Interno!', detail: 'Houve um erro interno ao alterar as informações.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar os Dados!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  editPasswordWithOldPassword(data: any){
    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(`${this.endpoint}`, data, { withCredentials: true }).subscribe({
      next: (data) => {
        if (data.message){
          this.messageService.add({severity: 'success', summary: 'Senha Alterada!', detail: data.message});
          resolve(true);
        } else {
          this.messageService.add({severity: 'error', summary: 'Erro ao Alterar a Senha!', detail: data.message});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar a Senha!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  createUser(data: any){
    return new Promise<boolean>((resolve, _) => {this.http.post<any>(`${this.endpoint}`, data, { withCredentials: true }).subscribe({
      next: (data: any) => {
        if (data?.message){
          this.messageService.add({severity: 'success', summary: 'Usuário Criado!', detail: 'O usuário foi criado com sucesso!'});
          resolve(true);
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro ao Criar o Usuário!', detail: 'Houve um erro interno ao criar o usuário.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Criar o Usuário!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  deleteUser(userId: number){
    return new Promise<boolean>((resolve, _) => {this.http.delete(`${this.endpoint}/${userId}`, { withCredentials: true }).subscribe({
      next: (data: any) => {
        if (data?.message){
          this.messageService.add({severity: 'success', summary: 'Usuário Excluido!', detail: 'O usuário foi excluído com sucesso!'});
          resolve(true);
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro ao Excluir o Usuário!', detail: 'Houve um erro interno ao excluir o usuário.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Excluir o Usuário!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  sendEmailForgetPassword(data: any){
    return new Promise<any | boolean>((resolve, _) => {this.http.post<any>(`${this.endpoint}`, data).subscribe({
      next: (data) => {
        if (data && data?.message){
          this.messageService.add({severity: 'success', summary: 'E-mail Enviado!', detail: data.message});
          resolve(data);
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro ao Enviar o E-mail!', detail: 'Ocorreu um erro ao tentar enviar o E-mail de recuperação.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Enviar o E-mail!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  validateHashCode(data: any){
    return new Promise<boolean>((resolve, _) => {this.http.post<any>(`${this.endpoint}`, data).subscribe({
      next: (data) => {
        if (data && data?.userId){
          this.messageService.add({severity: 'success', summary: 'Código Validado!', detail: 'Código de confirmação validado.'});
          resolve(true);
        } else{
          this.messageService.add({severity: 'error', summary: 'Código Inválido!', detail: 'O código de confirmação informado é inválido ou esta expirado.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Código Inválido!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }

  editPasswordWithOutOldPassword(userId: string, data: any){
    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(`${this.endpoint}/${userId}`, data).subscribe({
      next: (data) => {
        if (data && data?.message){
          this.messageService.add({severity: 'success', summary: 'Senha Alterada com Sucesso!', detail: 'A senha foi modificada com sucesso.'});
          resolve(true);
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro ao Alterar a Senha!', detail: 'Ocorreu um erro durante a alteração da senha.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar a Senha!', detail: error.error.detail});
        resolve(false);
      }
    })});
  }
}
