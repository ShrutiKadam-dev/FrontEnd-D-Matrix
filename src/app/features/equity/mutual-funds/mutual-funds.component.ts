import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FeaturesService } from '../../features.service';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
@Component({
  selector: 'app-mutual-funds',
  standalone: true,
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    MessagesModule,
    MessageModule,

  ],
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.scss']
})
export class MutualFundsComponent implements OnInit {

  selectedMfName: any = null;
  filteredMfNames: any[] = [];
  allMfs: any[] = [];
  displayMfs: any[] = [];
  currentIndex = 0;
  itemsPerPage = 3;
  actionTableList: any[] = [];
  messages: Message[] = [];
  
  @ViewChild('dt') dt!: Table;

  private featuresService = inject(FeaturesService);

  ngOnInit() {
    this.getMutualFunds();
    this.getAllActionTable()
  }

  getMutualFunds() {
    this.featuresService.getAllMutualFund().subscribe({
      next: (res: any) => {
        this.allMfs = res?.data || [];
        this.updateDisplay();
      },
      error: () => console.error('Failed to load Mutual Funds')
    });
  }

  updateDisplay() {
    this.displayMfs = this.allMfs.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  }

  scrollToMf(mf: any) {
    if (mf) {
      this.displayMfs = [mf]; // show only selected MF card
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
    this.currentIndex = 0;
    this.updateDisplay();
  }

  nextPage() {
    if (this.currentIndex + this.itemsPerPage < this.allMfs.length) {
      this.currentIndex += this.itemsPerPage;
      this.updateDisplay();
    }
  }

  prevPage() {
    if (this.currentIndex - this.itemsPerPage >= 0) {
      this.currentIndex -= this.itemsPerPage;
      this.updateDisplay();
    }
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

    getAllActionTable() {
    this.featuresService.getAllActionTable().subscribe({
      next: (data: any) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
      },
      error: (err) => {
        this.messages = [{
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to load entities'
        }];
      }
    });
}

}