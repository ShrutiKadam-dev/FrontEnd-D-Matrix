import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FeaturesService } from '../../features.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    TagModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    TableModule,
    InputTextModule,
    AutoCompleteModule,
    CarouselModule,
    CardModule,
    FormsModule
  ],
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.scss']
})
export class MutualFundsComponent implements OnInit {
  selectedMfName: any = null;
  filteredMfNames: any[] = [];
  allMfs: any[] = [];
  displayMfs: any[] = [];
  actionTableList: any[] = [];

  @ViewChild('dt') dt!: Table;
  constructor(private router: Router) { }

  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

  // Carousel responsive breakpoints
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit() {
    this.getAllMutualFunds();
    this.getAllActionTable();
  }

  goToMfDetails(mf: any) {
    this.router.navigate(['/features/equity/mutual-fund-details', mf.entityid]);
  }

  getAllMutualFunds() {
    this.featuresService.getAllMutualFund().subscribe({
      next: (res: any) => {
        this.allMfs = res?.data || [];
        this.allMfs.forEach(mf => {
        mf.color = this.getColor(mf.subcategory);
      });
   
        this.displayMfs = [...this.allMfs]; // for carousel
      },
      error: () => console.error('Failed to load Mutual Funds')
    });
  }

  getAllActionTable() {
    this.featuresService.getAllActionTableOfMutualFund().subscribe({
      next: (data: any) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Failed to load entities'
        });
      }
    });
  }


  scrollToMf(mf: any) {
    if (mf) {
      this.displayMfs = [mf]; // show only selected MF card in search mode
    }
  }

  searchMfs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredMfNames = this.allMfs.filter(mf =>
      mf.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedMfName = null;
    this.displayMfs = [...this.allMfs]; // restore carousel items
  }

  getColor(nickname?: string) {
    const predefinedColors: { [key: string]: string } = {
      'MF1': '#FFD580',
      'MF2': '#FFB3B3',
      'MF3': '#B3E5FF'
    };

    if (nickname && predefinedColors[nickname]) {
      return predefinedColors[nickname];
    }

    // Generate random pastel color
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) {
      this.dt.filter(input.value, 'global', 'contains');
    }
  }

  
getSeverity(orderType: string) {
  switch (orderType?.trim()?.toUpperCase()) {
    case 'PURCHASE':
      return 'success';
    case 'SELL':
      return 'danger';
    default:
      return 'info';
  }
}

}


