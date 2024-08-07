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
      this.theme.next(localTheme.themePreference);

      const linkElement = document.getElementById('app-theme') as HTMLLinkElement;
      linkElement.href = localTheme.themePreference + '.css';
    }
  }

  toggleTheme() {
    const linkElement = document.getElementById('app-theme') as HTMLLinkElement;

    if (this.theme.value == 'dark') {
      linkElement.href = 'light.css';
      this.theme.next('light');
    } else {
      linkElement.href = 'dark.css';
      this.theme.next('dark');
    }
    this.localStorage.setLocalStorage('THEME-BASIC-TEMPLATE', {themePreference: this.theme.value}, false);
  }
}
