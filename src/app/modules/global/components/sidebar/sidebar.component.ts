import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DrawerModule, Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { ButtonThemeComponent } from '../button-theme/button-theme.component';
import { ISidebarRoute } from '../../interfaces/ISidebarRoute';
import { ISigninData } from '../../interfaces/ISignin';

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

  userData!: ISigninData | null;
  sidebarVisible: boolean = false;

  availableRoutes!: ISidebarRoute[]

  @ViewChild('sidebarRef') sidebarRef!: Drawer;

  ngOnInit() {
    this.usersService.user$.subscribe((data) => {
      this.userData = data;
    });

    this.availableRoutes = [
      {
        label: 'GERAL',
        codesCanAccess: [],
        rolesCanAccess: ['ALL'],
        hidden: false,
        status: true,
        routes: [
          {
            route: '/home',
            routeQuery: [],
            label: 'HOME',
            class: 'pi pi-home mr-2',
            codesCanAccess: [],
            rolesCanAccess: ['ALL'],
            status: true,
            routes: []
          }
        ]
      },
      {
        label: 'MODULO 1',
        codesCanAccess: [],
        rolesCanAccess: ['ALL'],
        hidden: false,
        status: true,
        routes: [
          {
            route: '/page1',
            routeQuery: [],
            label: 'PAGINA 1',
            class: 'pi pi-calendar mr-2',
            codesCanAccess: [],
            rolesCanAccess: ['ALL'],
            status: true,
            routes: []
          },
        ]
      },
      {
        label: 'MODULO 2',
        codesCanAccess: [],
        rolesCanAccess: ['ALL'],
        hidden: false,
        status: true,
        routes: [
          {
            route: '/page2',
            routeQuery: [],
            label: 'PAGINA 2',
            class: 'pi pi-users mr-2',
            codesCanAccess: [],
            rolesCanAccess: ['ALL'],
            status: true,
            routes: []
          },
        ]
      },
    ];
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  navigateTo(route: string) {
    this.sidebarVisible = false;
    this.router.navigate([route]);
  }

  navigateToWithQuery(route: string, target: string) {
    this.sidebarVisible = false;
    this.router.navigate([route], { queryParams: { target } });
  }

  async logout() {
    await this.usersService.logout();
  }

  canAccess(rolesCanAccess: string[]): boolean {
    if (!rolesCanAccess?.length) return false;

    if (rolesCanAccess.includes('ALL')) return true;

    return this.userData?.user?.roles?.some((pr: any) =>
      rolesCanAccess.includes(pr.role)
    ) ?? false;
  }

  canAccessRoute(routeRoles: string[]): boolean {
    if (routeRoles.includes('ALL')) return true;

    return this.userData?.user?.roles?.some((pr: any) =>
      routeRoles.includes(pr.role)
    ) ?? false;
  }

  customClose() {
    this.sidebarVisible = false;
  }
}
