import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';  // ⬅ Needed for toggle button
import { TooltipModule } from 'primeng/tooltip'; // ⬅ Needed for tooltips

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    RouterModule, 
    PanelMenuModule, 
    CardModule,
    ToastModule, 
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  showSidebar = true;
  isCollapsed = false;   // ⬅ NEW: collapse state

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects.split('?')[0];
        this.showSidebar = !currentUrl.startsWith('/auth');
      });

    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/features/home'],
        tooltipOptions: { tooltipLabel: 'Home', tooltipPosition: 'right' }
      },
      {
        label: 'Equity',
        icon: 'pi pi-chart-line',
        routerLink: ['/features/equity'],
        tooltipOptions: { tooltipLabel: 'Equity', tooltipPosition: 'right' },
        items: [
          { 
            label: 'Direct Equity', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/equity/direct-equity']
          },
          { 
            label: 'Mutual Funds', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/equity/mutual-funds']
          },
          { 
            label: 'AIF', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/equity/aif']
          },
          { 
            label: 'ETF', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/equity/etf']
          },
          { 
            label: 'PMS', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/equity/PMS']
          },
        ]
      },
      {
        label: 'Fixed Income',
        icon: 'pi pi-dollar',
        routerLink: ['/features/fixed-income'],
        tooltipOptions: { tooltipLabel: 'Fixed Income', tooltipPosition: 'right' },
        items: [
          { 
            label: 'Direct Debt', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/fixed-income/direct-equity']
          },
          { 
            label: 'ETF', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/fixed-income/etf']
          },
          { 
            label: 'AIF', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/fixed-income/aif']
          },
        ]
      },
      {
        label: 'Commodities',
        icon: 'pi pi-globe',
        routerLink: ['/features/commodities'],
        tooltipOptions: { tooltipLabel: 'Commodities', tooltipPosition: 'right' },
        items: [
          { 
            label: 'ETF', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/commodities/etf']
          },
          { 
            label: 'Direct Equity', 
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/commodities/direct-equity']
          },
          // { 
          //   label: 'AIF', 
          //   icon: 'pi pi-arrow-right',
          //   routerLink: ['/features/commodities/aif']
          // },
        ]
      },
      {
        label: 'Entity',
        icon: 'pi pi-plus-circle',
        routerLink: ['/features/create'],
        tooltipOptions: { tooltipLabel: 'Entity', tooltipPosition: 'right' }
      }
    ];
  }
}
