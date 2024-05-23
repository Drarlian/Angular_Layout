import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ILoginRequest, ILoginResponse } from '../../interfaces/IUsers';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private user = new BehaviorSubject<ILoginResponse | null>(null);
  userInformations = this.user.asObservable();

  signIn(infos: ILoginRequest): Promise<boolean> {
    return new Promise((resolve, _) => { this.http.post<ILoginResponse>('/signin', infos).subscribe({
      next: (data) => {  // try
        if (data.status){
          this.user.next(data);
          localStorage.setItem('cashback-user', JSON.stringify(data));
          resolve(true)  // Resolve a Promise, retornando o valor informado.
        } else{
          resolve(false)  // Resolve a Promise, retornando o valor informado.
        }
    }, 
      error: (error) => {  // catch
        console.log(error);
        resolve(false)  // Resolve a Promise, retornando o valor informado.
      }
    })});
  }

  logOut(){
    localStorage.removeItem('cashback-user');
    this.user.next(null);
    this.router.navigate(['/sign-in']);
  }

  verifyUser(){
    if (this.user.value?.status){
      return true
    } else{
      const checkedUser = localStorage.getItem('cashback-user')
      if (checkedUser){
        this.user.next(JSON.parse(checkedUser));
        return true
      }
      return false
    }
  }
}
