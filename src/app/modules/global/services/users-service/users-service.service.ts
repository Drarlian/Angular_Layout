import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {
  http = inject(HttpClient)

  // Método para GET
  getAllMessages(): any {
    return this.http.get('/all')
  }
}
