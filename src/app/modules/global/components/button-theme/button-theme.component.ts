import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme/theme.service';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-button-theme',
  standalone: true,
  imports: [ToggleButtonModule, FormsModule, CommonModule],
  templateUrl: './button-theme.component.html',
  styleUrl: './button-theme.component.scss'
})
export class ButtonThemeComponent implements OnInit {
  themeService = inject(ThemeService);

  themeData!: string;
  isDarkTheme: boolean = true;

  ngOnInit() {
    this.themeService.themeInformation.subscribe(data => {
      this.themeData = data;

      if (data == 'dark'){
        this.isDarkTheme = true;
      } else {
        this.isDarkTheme = false;
      }
    });
  }

  toggleLightDark(){
    this.themeService.toggleDarkMode();
  }
}
