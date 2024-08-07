import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private cookieService = inject(CookieService);
  usersService = inject(UsersService);

  private visible = new BehaviorSubject<boolean>(false);
  visibleInformation = this.visible.asObservable();

  constructor() {
    // A notificação aparece apenas se o usuário estiver logado.

    // COMENTADO ENQUANTO A NOTIFICAÇÃO NÃO PRECISA APARECER.
    // this.usersService.userInformations.subscribe((data) => {
    //   if(data){
    //     if(!this.cookieService.get('notification')){
    //       this.visible.next(true);
    //       this.cookieService.set('notification', `${JSON.stringify({viewed: false})}`, 1);
    //     } else{
    //       if(!JSON.parse(this.cookieService.get('notification')).viewed){
    //         this.visible.next(false);
    //       this.cookieService.set('notification', `${JSON.stringify({viewed: true})}`, 1);
    //       }
    //     }
    //   }
    //   return null
    // })
  }

  toggleVisibility() {
    if (this.visible.value == true){
      this.visible.next(false);

      // Guardando um valor nos Cookies por um período de 7 dias.
      this.cookieService.set('notification', `${JSON.stringify({viewed: true})}`, 1);
    } else{
      this.visible.next(true);

      // Guardando um valor nos Cookies por um período de 7 dias.
      this.cookieService.set('notification', `${JSON.stringify({viewed: false})}`, 1);
    }
  }

  customClose() {
    this.visible.next(false);

    // Guardando um valor nos Cookies por um período de 7 dias.
    this.cookieService.set('notification', `${JSON.stringify({viewed: true})}`, 1);
  }

  // getCookieInformation(){
  //   try{
  //     const notificationData = JSON.parse(this.cookieService.get('notification'));

  //     if(!notificationData){
  //       this.visible.next(true);
  //       this.cookieService.set('notification', `${JSON.stringify({viewed: true})}`, 1);
  //       return null
  //     }

  //     if (notificationData && !notificationData.viewed){
  //       console.log(notificationData.viewed);
  //       this.visible.next(true);
  //       this.cookieService.set('notification', `${JSON.stringify({viewed: true})}`, 1);
  //       return null
  //     }

  //     this.visible.next(false);
  //     this.cookieService.set('notification', `${JSON.stringify({viewed: false})}`, 1);
  //     return null
  //   } catch{
  //     this.visible.next(true);
  //     this.cookieService.set('notification', `${JSON.stringify({viewed: true})}`, 1);
  //     return null
  //   }
  // }
}
