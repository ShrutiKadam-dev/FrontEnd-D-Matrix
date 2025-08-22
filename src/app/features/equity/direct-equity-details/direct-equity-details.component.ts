import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { FeaturesService } from '../../features.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-direct-equity-details',
  imports: [
        ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    TableModule,
    InputTextModule,
    AutoCompleteModule,
    CarouselModule,
    CardModule,
    FormsModule,DatePickerModule
  ],
  templateUrl: './direct-equity-details.component.html',
  styleUrl: './direct-equity-details.component.scss'
})
export class DirectEquityDetailsComponent implements OnInit{
  deId!: string | null;
  deDetails: any;
  actionTableList: any[] = [];

  @ViewChild('actionTable') actionTable!: Table;

  private route = inject(ActivatedRoute);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.deId = this.route.snapshot.paramMap.get('id');
    if (this.deId) {
      this.loadMfDetails(this.deId);
      this.getDEDetailActionTable(this.deId);
    }
  }


  onGlobalFilter(event: Event, tableType: 'action') {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      if (tableType === 'action') {
        this.actionTable.filterGlobal(input.value, 'contains');
      }
    }
  }

  loadMfDetails(id: string) {
    this.featuresService.getDirectEquityDetailsById(id).subscribe({
      next: (res: any) => {
        this.deDetails = res?.data || {};
      },
      error: (err: any) => {
        console.error('Failed to load Mutual Fund details', err);
      }
    });
  }


  getDEDetailActionTable(deId: string) {
    this.featuresService.getDEDetailActionTable(deId).subscribe({
      next: (data) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Failed to load actions'
        });
      }
    });
  }


}
