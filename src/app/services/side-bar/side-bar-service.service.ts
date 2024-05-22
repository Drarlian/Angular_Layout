import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarServiceService {
  constructor() { }

  private isOpenObservable = new BehaviorSubject<boolean>(false);
  isOpen = this.isOpenObservable.asObservable();

  toggleSideBar() {
    this.isOpenObservable.next(!this.isOpenObservable.value)
  }
}
