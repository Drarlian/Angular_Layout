import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import { ISigninResponse } from '../../interfaces/ISignin';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../services/notifications/notifications.service';
// import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, SplitButtonModule, InputTextModule, SidebarComponent, AvatarModule, AvatarGroupModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  usersService = inject(UsersService);
  notificationsService = inject(NotificationsService);

  items: MenuItem[] | undefined;
  userData!: ISigninResponse | null;

  ngOnInit() {
      this.items = [
          {
              label: 'Update',
              icon: 'pi pi-refresh'
          },
          {
              label: 'Delete',
              icon: 'pi pi-times'
          }
      ];

      this.usersService.userInformations.subscribe((data) => {
        this.userData = data;
      })
  }

  openNotification(){
    this.notificationsService.toggleVisibility();
  }
}
