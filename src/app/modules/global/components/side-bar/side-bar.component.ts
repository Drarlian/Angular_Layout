import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SideBarServiceService } from '../../services/side-bar/side-bar-service.service';
import { UsersService } from '../../../../services/users-service/users.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  constructor(private sideBarServiceService: SideBarServiceService, private router: Router, private userServices: UsersService) {}

  isOpen!: boolean;

  ngOnInit() {
    this.sideBarServiceService.isOpen.subscribe(status => {
      this.isOpen = status;
    });
  }

  toggleSideBar() {
    this.sideBarServiceService.toggleSideBar();
  }

  changePage(rota: string) {
    this.toggleSideBar();
    this.router.navigate([rota]);
  }

  logout(){
    this.userServices.logOut();
  }
}