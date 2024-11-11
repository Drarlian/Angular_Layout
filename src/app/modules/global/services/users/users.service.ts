import { inject, Injectable } from '@angular/core';
import { ISigninRequest, ISigninResponse } from '../../interfaces/ISignin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { StorageService } from '../local-storage/storage.service';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../interfaces/IUser';

const mockUser: ISigninResponse = {
  user: {
    collaboratorId: 1,
    name: 'Renato',
    lastName: 'Tester',
    email: 'renato@teste.com.br',
    sectors: ['SETOR1', 'SETOR2'],
    access: {
      accessId: 1,
      username: 'renato.tester',
      password: 'dfsjbosidhfgsdhfbgisdfg',
      role: 'TESTER'
    },
    systems: ['SISTEMA1', 'SISTEMA2'],
    teams: ['TIME1', 'TIME2']
  },
  authorities: ['AUTORIDADE1', 'AUTORIDADE2'],
  token: 'SDJFBISAJUDBFIUSHDCNSAHDNJSDFBNOAUWREBFEHRBHBDFHSJB'
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private localStorageService = inject(StorageService);

  private user = new BehaviorSubject<ISigninResponse | null>(null);
  userInformations = this.user.asObservable();

  constructor() {
    const localUser = this.localStorageService.getLocalStorage('USER-BASIC-TEMPLATE');

    if (localUser){
      this.user.next(localUser);
    }
  }

  signin(informations: ISigninRequest){
    if (informations.username == 'admin' && informations.password == 'admin'){
      this.user.next(mockUser)
      this.localStorageService.setLocalStorage('USER-BASIC-TEMPLATE', mockUser, false, false);
      return true
    }

    return new Promise<boolean>((resolve, _) => {this.http.post<ISigninResponse>('', informations).subscribe({
      next: (data) => {
        this.user.next(data);
        this.localStorageService.setLocalStorage('USER-BASIC-TEMPLATE', data, false, false);
        resolve(true);
      },
      error: (error: any) => {
        console.log(error)
        this.messageService.add({severity: 'error', summary: 'Login Inválido', detail: 'Impossível realizar o login!'})
        resolve(false);
      }
    })})
  }

  logout(){
    this.localStorageService.deleteLocalStorage('USER-BASIC-TEMPLATE');
    window.location.reload();
  }

  redirectUser(){
    // Essa abordagem garante que a mensagem de login seja enviada apenas quando o site receptor estiver pronto,
    // tornando o sistema mais robusto e menos dependente de temporizadores arbitrários.

    // A função redirectUser abre uma nova janela e espera uma mensagem 'ready' dessa nova janela.

    // Quando a mensagem 'ready' é recebida, a função envia o valor do usuário para a nova janela e então remove o listener para evitar futuras execuções desnecessárias.
    // A função receiveReadyMessage não roda em loop, mas sim é chamada toda vez que a janela principal recebe uma mensagem e é removida após a primeira execução bem-sucedida.

    if (this.user.value) {
      const targetWindow = window.open('http://localhost:55014/home', '_blank');
      if (targetWindow) {
        const receiveReadyMessage = (event: MessageEvent) => {
          if (event.origin === 'http://localhost:55014' && event.data === 'ready') {
            targetWindow.postMessage(this.user.value, 'http://localhost:55014');
            window.removeEventListener('message', receiveReadyMessage);
          }
        };
        window.addEventListener('message', receiveReadyMessage);
      }
    }
  }


  // METODOS ESPECIFICOS:
  getTokenAuthorization() {
    return new HttpHeaders({
      'Content-type':  'application/json',
      'Authorization' : this.user.value?.token ? this.user.value?.token: ''
    })
  }

  findAllUsers(){
    const headers = this.getTokenAuthorization();

    return new Promise<IUser[] | []>((resolve, _) => {this.http.get<IUser[]>('', { headers }).subscribe({
      next: (data) => {
        if (data){
          // this.allUsers.next(data);
          resolve(data);
        } else{
          // this.allUsers.next([]);
          resolve([]);
        }
      },
      error: (error: any) => {
        // this.allUsers.next([]);
        resolve([]);
      }
    })})
  }

  findOneUser(id: number){
    const headers = this.getTokenAuthorization()

    return new Promise<IUser | null>((resolve, _) => {this.http.get<IUser>(``, { headers }).subscribe({
      next: (data) => {
        if (data){
          // this.allUsers.next(data);
          resolve(data);
        } else{
          // this.allUsers.next([]);
          resolve(null);
        }
      },
      error: (error: any) => {
        // this.allUsers.next([]);
        resolve(null);
      }
    })})
  }

  // Own/Target Information
  editUserBasic(id: number, informations: any, ownInformation: boolean = true){
    const headers = this.getTokenAuthorization()

    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(``, informations, { headers }).subscribe({
      next: (data) => {
        // Alterando as informações do usuário atual (user) e mantendo o token que ele já tinha.
        if (data){
          if (ownInformation){
            const token = this.user.value?.token ? this.user.value?.token : '';
            // this.user.next({user: data, token: token});  // -> ATUALIZAR OS DADOS DO USUARIO.
            this.localStorageService.setLocalStorage('USER-BASIC-TEMPLATE', {user: data, token: token}, true, false);
          }
          this.messageService.add({severity: 'success', summary: 'Dados Alterados!', detail: 'As informações foram alteradas com sucesso.'});
          resolve(true);
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro Interno!', detail: 'Houve um erro interno ao alterar as informações.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar os Dados!', detail: 'Houve um erro ao alterar as informações.'});
        resolve(false);
      }
    })})
  }

  // Own/Target Information
  editUserAdvanced(id: number, informations: any, ownInformation: boolean){
    const headers = this.getTokenAuthorization();

    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(``, informations, { headers }).subscribe({
      next: (data) => {
        if (data){
          // TO DO: Após alterar os dados avançados do usário eu devo deslogar ele do sistema, mas antes disso eu devo avisar a ele atraves de um PopUp que ele será deslogado se confirmar a troca das informações.
          // (Isso vai acontecer apenas no editUserAdvanced pois o token é regerado ao fazer essa atualização)

          // Alterando as informações do usuário atual (user) e mantendo o token que ele já tinha.
          const token = this.user.value?.token ? this.user.value?.token : '';

          let newUser: ISigninResponse | null = this.user.value;
          if (newUser){
            if(ownInformation){
              // newUser = {user: {...newUser?.user, access: {...newUser?.user.access, id: data.id, username: data.username, password: data.password, role: data.role}}, token: token};
              // ATUALIZAR INFORMAÇÕES DO USUÁRIO.

              this.user.next(newUser);
              this.localStorageService.setLocalStorage('USER-BASIC-TEMPLATE', newUser, true);
            }
            this.messageService.add({severity: 'success', summary: 'Dados Alterados!', detail: 'As informações foram alteradas com sucesso.'});
            resolve(true);
          }
        } else{
          this.messageService.add({severity: 'error', summary: 'Erro Interno!', detail: 'Houve um erro interno ao alterar as informações.'});
          resolve(false);
        }
      },
      error: (error: any) => {
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar os Dados!', detail: 'Houve um erro ao alterar as informações.'});
        resolve(false);
      }
    })})
  }

  // Own Information
  editPasswordWithOldPassword(id: number, informations: any){
    const headers = this.getTokenAuthorization();

    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(``, informations, { headers }).subscribe({
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
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar a Senha!', detail: error.error.message});
        resolve(false);
      }
    })})
  }

  createUser(informations: any){
    const headers = this.getTokenAuthorization()

    return new Promise<boolean>((resolve, _) => {this.http.post<any>('', informations, { headers }).subscribe({
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
        this.messageService.add({severity: 'error', summary: 'Erro ao Criar o Usuário!', detail: 'Houve um erro ao criar o usuário.'});
        resolve(false);
      }
    })})
  }

  deleteUser(id: number){
    const headers = this.getTokenAuthorization()

    return new Promise<boolean>((resolve, _) => {this.http.delete(``, { headers }).subscribe({
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
        this.messageService.add({severity: 'error', summary: 'Erro ao Excluir o Usuário!', detail: 'Houve um erro ao excluir o usuário.'});
        resolve(false);
      }
    })})
  }

  sendEmailForgetPassword(informations: any){
    return new Promise<any | boolean>((resolve, _) => {this.http.post<any>('', informations).subscribe({
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
        this.messageService.add({severity: 'error', summary: 'Erro ao Enviar o E-mail!', detail: 'Ocorreu um erro ao tentar enviar o E-mail de recuperação.'});
        resolve(false);
      }
    })})
  }

  validateHashCode(informations: any){
    return new Promise<boolean>((resolve, _) => {this.http.post<any>('', informations).subscribe({
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
        this.messageService.add({severity: 'error', summary: 'Código Inválido!', detail: 'O código de confirmação informado é inválido ou esta expirado.'});
        resolve(false);
      }
    })})
  }

  editPasswordWithOutOldPassword(informations: any, id: string){
    return new Promise<boolean>((resolve, _) => {this.http.patch<any>(``, informations).subscribe({
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
        this.messageService.add({severity: 'error', summary: 'Erro ao Alterar a Senha!', detail: 'Ocorreu um erro durante a alteração da senha.'});
        resolve(false);
      }
    })})
  }
}
