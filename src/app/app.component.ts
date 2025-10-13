import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { Location } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    BreadcrumbModule,
    RouterModule,
    PanelMenuModule,
    CardModule,
    ToastModule,
    ButtonModule,
    TooltipModule,
    MenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  profileItems: MenuItem[] = [];

  showSidebar = true;
  showNavBar = true;
  isCollapsed = false;

  breadcrumbItems: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/features/home', title: 'Home' };

  showBackButton = false;

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects.split('?')[0];

        this.showSidebar = !currentUrl.startsWith('/auth');
        this.showNavBar = !currentUrl.startsWith('/auth');

        // Update breadcrumbs and back button
        this.updateBreadcrumbs(currentUrl);
        this.showBackButton = currentUrl !== '/home';
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
            routerLink: ['/features/fixed-income/direct-debt']
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
        label: 'Compare',
        icon: 'pi pi-arrow-right-arrow-left',
        routerLink: ['/features/compare'],
        tooltipOptions: { tooltipLabel: 'Compare', tooltipPosition: 'right' }
      },
      {
        label: 'Entity',
        icon: 'pi pi-plus-circle',
        routerLink: ['/features/create'],
        tooltipOptions: { tooltipLabel: 'Entity', tooltipPosition: 'right' }
      }
    ];

    this.profileItems = [
      {
        label: 'Edit Profile',
        icon: 'pi pi-user-edit',
        command: () => this.router.navigate(['/features/profile'])
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }
  
  goBack() {
    this.location.back();
  }

  updateBreadcrumbs(url: string) {
    const cleanUrl = url.replace(/^\/features/, '');
    const segments = cleanUrl.split('/').filter(seg => seg);

    this.breadcrumbItems = segments.map((seg, index) => ({
      label: this.formatLabel(seg),
      routerLink: ['/features', ...segments.slice(0, index + 1)], // <-- Use array for proper routerLink
      title: this.formatLabel(seg)
    }));
  }

  formatLabel(str: string) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  logout() {
    console.log('User logged out');
    this.router.navigate(['/auth/login']);
  }
}
