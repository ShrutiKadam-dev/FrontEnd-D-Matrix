import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HomeComponent } from './features/home/home.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,LoginComponent,CommonModule, PanelMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title(title: any) {
    throw new Error('Method not implemented.');
  }
loggedIn:boolean=true;
loggedOut:boolean=false
  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    routerLink: ['/home']
  },
  {
    label: 'Equity',
    icon: 'pi pi-home',
    items: [
      { label: 'Direct Equity', routerLink: ['/equity/direct'] },
      { label: 'Mutual Funds', routerLink: ['/features/home'] },
      { label: 'Alternative Investment Funds', routerLink: ['/equity/aif'] },
      { label: 'Direct PE', routerLink: ['/equity/direct-pe'] },
      { label: 'PE AIF', routerLink: ['/equity/pe-aif'] }
    ]
  },
  {
    label: 'Fixed Income',
    icon: 'pi pi-plus',
    routerLink: ['/fixed-income'],
        items: [
      { label: 'Direct Equity', routerLink: ['/equity/direct'] },
      { label: 'Mutual Funds', routerLink: ['/features/home'] },
      { label: 'Alternative Investment Funds', routerLink: ['/equity/aif'] },
      { label: 'Direct PE', routerLink: ['/equity/direct-pe'] },
      { label: 'PE AIF', routerLink: ['/equity/pe-aif'] }
    ]
  },
  {
    label: 'Commodities',
    icon: 'pi pi-home-dollar', // Optional: replace with custom icon if needed
    routerLink: ['/commodities']
  },
  {
    label: '---------------------------',
    disabled: true,
    styleClass: 'menu-divider'
  },
  {
    label: 'Create',
    icon: 'pi pi-plus-circle',
    routerLink: ['/features/create']
  }
];

  }
   
}
