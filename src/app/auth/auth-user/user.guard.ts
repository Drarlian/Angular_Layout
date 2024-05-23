import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../../services/users-service/users.service';

export const userGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  const isAuthenticated = usersService.verifyUser();

  // Validando as rotas sign-in e home.

  // Impedindo que o usuario entre na rota de login caso ele já esteja logado.
  if (route.url[0]?.path == 'sign-in' && isAuthenticated){
    router.navigate(['/home']);
    return false
  }

  // Permitindo que o usuário entre na rota de login caso ele não esteja logado.
  if (route.url[0]?.path == 'sign-in' && !isAuthenticated){
    return true
  }

  // Permitindo que o usuário entre na rota home caso ele esteja logado. (Só vou chegar nesse momento do código se a rota for home)
  if (isAuthenticated) {
    return true;
  }


  // Negando a entrada do usuário na rota home caso ele não esteja logado. (Só vou chegar nesse momento do código se a rota for home)
  router.navigate(['/sign-in']);
  return false;
};
