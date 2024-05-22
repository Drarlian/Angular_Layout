import { Component } from '@angular/core';
import { SideBarServiceService } from '../../../services/side-bar/side-bar-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private sideBarServiceService: SideBarServiceService) {}

  isSideBarOpen!: boolean

  toggleSideBar(){
    this.sideBarServiceService.toggleSideBar();
  }
}
