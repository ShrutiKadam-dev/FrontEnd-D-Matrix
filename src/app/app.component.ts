import { Component, inject, OnInit } from '@angular/core';
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
import { FeaturesService } from './features/features.service';

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

  private featuresService = inject(FeaturesService);

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects.split('?')[0];

        // Update breadcrumbs and back button
        this.updateBreadcrumbs(currentUrl);

        this.showSidebar = !currentUrl.startsWith('/auth');
        this.showNavBar = !currentUrl.startsWith('/auth');

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
            routerLink: ['/features/equity/AIF']
          },
          {
            label: 'ETF',
            icon: 'pi pi-arrow-right',
            routerLink: ['/features/equity/ETF']
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
            routerLink: ['/features/fixed-income/ETF']
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
            routerLink: ['/features/commodities/ETF']
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
      routerLink: ['/features', ...segments.slice(0, index + 1)],
      title: this.formatLabel(seg)
    }));

    // Detect Mutual Fund ID (like ENT-0329) and replace its label with real name
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment.startsWith('ENT')) {
      this.featuresService.getEntityById(lastSegment).subscribe({
        next: (res: any) => {
          const fundName = res?.data?.[0]?.scripname || lastSegment;

          this.breadcrumbItems = this.breadcrumbItems.map((item, i) =>
            i === this.breadcrumbItems.length - 1
              ? { ...item, label: fundName, title: fundName }
              : item
          );
        },
        error: (err: any) => console.error('Failed to load fund details', err)
      });
    }
  }

  formatLabel(str: string) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  logout() {
    console.log('User logged out');
    this.router.navigate(['/auth/login']);
  }
}
