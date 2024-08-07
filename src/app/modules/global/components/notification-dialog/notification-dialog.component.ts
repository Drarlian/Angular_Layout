import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent implements OnInit {
  notificationsService = inject(NotificationsService);

  // Inicio da Caixa do Dialogo
  visible!: boolean;

  ngOnInit() {
    this.notificationsService.visibleInformation.subscribe(data => this.visible = data);
  }

  toggleVisibility() {
    this.notificationsService.toggleVisibility();
  }

  customClose() {
    this.notificationsService.customClose();
  }
  // Fim da Caixa do Dialogo
}
