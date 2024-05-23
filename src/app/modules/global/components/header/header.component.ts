import { UsersService } from './../../../../services/users-service/users.service';
import { Component } from '@angular/core';
import { SideBarServiceService } from '../../services/side-bar/side-bar-service.service';
import { ILoginResponse } from '../../../../interfaces/IUsers';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private sideBarServiceService: SideBarServiceService, private user: UsersService) {}

  userInfos!: ILoginResponse;

  ngOnInit() {
    this.user.userInformations.subscribe((data: any) => {
      this.userInfos = data;
    })
  }

  isSideBarOpen!: boolean

  toggleSideBar(){
    this.sideBarServiceService.toggleSideBar();
  }
}
