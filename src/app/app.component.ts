import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { ThemeService } from './modules/global/services/theme/theme.service';
import { UsersService } from './modules/global/services/users/users.service';
import { ToastModule } from 'primeng/toast';
import { ButtonSupportComponent } from './modules/global/components/button-support/button-support.component';
import { NotificationsService } from './modules/global/services/notifications/notifications.service';
import { NotificationDialogComponent } from './modules/global/components/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ButtonSupportComponent, NotificationDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-test-camp';

  constructor(private primeng: PrimeNG, private themeService: ThemeService, usersService: UsersService, private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
