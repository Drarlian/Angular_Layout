import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { StorageService } from '../local-storage/storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localStorage = inject(StorageService);

  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const storage = this.localStorage.getLocalStorage('USER-BASIC-TEMPLATE');

    // Código temporário ate a logica de expirar o token.
    if(storage){
      return true
    } else{
      return false
    }

    // Verificando se o tempo expirou - Parte 2 (Parte 1 no UserService)
    const actualDate = new Date();
    if (storage?.expiration){
      if (actualDate.getTime() < storage.expiration){
        return true
      } else{
        return false
      }
    } else{
      return false
    }
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // next: Contém todas as informações sobre a rota atual, como parâmetros, dados estáticos, resolvedores e o caminho da URL segmentado (array com a url separada por /).
    // state: Representa o estado do roteador no momento atual. Ele contém informações sobre a árvore de rotas, permitindo acessar o estado completo do roteador, incluindo a URL como string.
    const isAuthenticated = this.isAuthenticated();

    // Impedindo que o usuario entre na rota de login caso ele já esteja logado.
    if ((next.url[0]?.path == 'signin' || next.url[0]?.path == 'forget-password') && isAuthenticated){
      this.router.navigate(['/home']);
      return false
    }

    // Permitindo que o usuário entre na rota de login caso ele não esteja logado.
    if ((next.url[0]?.path == 'signin' || next.url[0]?.path == 'forget-password') && !isAuthenticated){
      return true
    }

    // Permitindo que o usuário entre na rota home caso ele esteja logado. (Só vou chegar nesse momento do código se a rota for home)
    if (isAuthenticated) {
      return true
    }

    // Negando a entrada do usuário na rota caso ele não esteja logado. (Só vou chegar nesse momento do código se a rota for home)
    this.router.navigate(['/signin']);
    return false
  }
}
