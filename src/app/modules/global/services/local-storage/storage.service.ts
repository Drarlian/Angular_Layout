import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  setLocalStorage(key: string, informations: any, isUser: boolean, changeExpiration: boolean = true){
    if (isUser){
      const expirationTime = new Date().getTime() + (2 * 60 * 60 * 1000);

      // Caso queira trocar  a data de expiração.
      if (changeExpiration){
        const newInformations = JSON.stringify({value: informations, expiration: expirationTime});
        localStorage.setItem(key, newInformations);
      } else{
        const actualStorage = this.getLocalStorage(key);

        // Caso NÃO queira trocar a data de expiração e tenha algo no localStorage atual.
        if (actualStorage){
          const newInformations = JSON.stringify({value: informations, expiration: actualStorage.expiration});
          localStorage.setItem(key, newInformations);
        } else{
          // Caso NÃO queira trocar a data de expiração e NÃO tenha algo no localStorage atual.
          const newInformations = JSON.stringify({value: informations, expiration: expirationTime});
          localStorage.setItem(key, newInformations);
        }
      }
    } else {
      const newInformations = JSON.stringify(informations);
      localStorage.setItem(key, newInformations);
    }
  }

  setNormalLocalStorage(key: string, informations: any){
    const newInformations = JSON.stringify(informations);
    localStorage.setItem(key, newInformations);
  }

  getLocalStorage(key: string){
    const informations = localStorage.getItem(key);
    if (informations){
      return JSON.parse(informations)
    }
    return null
  }

  deleteLocalStorage(key: string){
    localStorage.removeItem(key);
  }
}
