import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeaturesService } from '../../features.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-mutual-fund',
  imports: [CommonModule],
  templateUrl: './sub-mutual-fund.component.html',
  styleUrl: './sub-mutual-fund.component.scss'
})
export class SubMutualFundComponent {
  mfId!: string | null;
  mfDetails: any;

  private route = inject(ActivatedRoute);
  private featuresService = inject(FeaturesService);

  ngOnInit() {
    // Get the ID from route params
    this.mfId = this.route.snapshot.paramMap.get('id');
    if (this.mfId) {
      this.loadMfDetails(this.mfId);
    }
  }

  loadMfDetails(id: string) {
    this.featuresService.getMutualFundDetailsById(id).subscribe({
      next: (res: any) => {
        this.mfDetails = res?.data || {};
      },
      error: (err: any) => {
        console.error('Failed to load Mutual Fund details', err);
      }
    });
  }
}
