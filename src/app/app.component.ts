// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, PanelMenuModule, CardModule,ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  menuItems: MenuItem[] = [];
  showSidebar = true;

 constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects.split('?')[0]; // remove query params
        this.showSidebar = !currentUrl.startsWith('/auth');
      });

    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/features/home'],
        styleClass: 'menu-item-custom'
      },
      {
        label: 'Equity',
        icon: 'pi pi-chart-line',
        styleClass: 'menu-item-custom',
        items: [
          { 
            label: 'Direct Equity', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/equity/direct'],
            styleClass: 'submenu-item-custom'
          },
          { 
            label: 'Mutual Funds', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/equity/mutual-funds'],
            styleClass: 'submenu-item-custom'
          },
          { 
            label: 'Alternative Investment Funds', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/equity/aif'],
            styleClass: 'submenu-item-custom'
          },
          { 
            label: 'Direct PE', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/equity/direct-pe'],
            styleClass: 'submenu-item-custom'
          },
          { 
            label: 'PE AIF', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/equity/pe-aif'],
            styleClass: 'submenu-item-custom'
          }
        ]
      },
      {
        label: 'Fixed Income',
        icon: 'pi pi-dollar',
        styleClass: 'menu-item-custom',
        routerLink: ['/fixed-income'],
        items: [
          { 
            label: 'Government Bonds', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/fixed-income/government'],
            styleClass: 'submenu-item-custom'
          },
          { 
            label: 'Corporate Bonds', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/fixed-income/corporate'],
            styleClass: 'submenu-item-custom'
          },
          { 
            label: 'Fixed Deposits', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/fixed-income/fd'],
            styleClass: 'submenu-item-custom'
          },
        ]
      },
      {
        label: 'Commodities',
        icon: 'pi pi-globe',
        routerLink: ['/features/commodities'],
        styleClass: 'menu-item-custom',
                items: [
          { 
            label: 'Direct Equity', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/equity/direct'],
            styleClass: 'submenu-item-custom'
          },]
      },
      {
        label: 'ACTIONS',
        disabled: true,
        styleClass: 'menu-divider'
      },
      {
        label: 'Create',
        icon: 'pi pi-plus-circle',
        routerLink: ['/features/create'],
        styleClass: 'menu-item-custom'
      }
    ];
  }

}