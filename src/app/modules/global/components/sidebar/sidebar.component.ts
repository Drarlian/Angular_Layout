import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DrawerModule, Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { ISigninResponse } from '../../interfaces/ISignin';
import { ButtonThemeComponent } from '../button-theme/button-theme.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [DrawerModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule, CommonModule, ButtonThemeComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);

  userData!: ISigninResponse | null;

  @ViewChild('sidebarRef') sidebarRef!: Drawer;

  closeCallback(e:any): void {
    this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;

  closeShadow(){
    this.sidebarVisible = false;
  }

  navigateTo(route: string){
    this.sidebarVisible = false;
    this.router.navigate([route]);
  }

  navigateToWithQuery(route: string, target: string){
    this.sidebarVisible = false;
    this.router.navigate([route], { queryParams: { target } });
  }

  logOut(){
    this.usersService.logout();
  }

  ngOnInit(){
    this.usersService.userInformations.subscribe((data) => {
      this.userData = data;
    });
  }
}
