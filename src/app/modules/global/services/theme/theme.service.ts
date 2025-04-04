import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../local-storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private localStorage = inject(StorageService);

  private theme = new BehaviorSubject<string>('dark');
  themeInformation = this.theme.asObservable();

  constructor() {
    const localTheme = this.localStorage.getLocalStorage('THEME-BASIC-TEMPLATE');

    if (localTheme){
      this.theme.next(localTheme);

      const linkElement = document.querySelector('html');
      if (linkElement !== null){
        if (localTheme == 'dark'){
          linkElement.classList.add('my-app-dark');
        }
      }
    }
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null){
      element.classList.toggle('my-app-dark');

      const themeValue = element.classList[0] != undefined ? 'dark' : 'light'
      this.localStorage.setNormalLocalStorage('THEME-BASIC-TEMPLATE', themeValue);
      this.theme.next(themeValue);
    }
  }
}
