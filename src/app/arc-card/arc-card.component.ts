import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FilterParams } from '../model/filter.params.model';
import { BaseCardComponent } from '../shared/base/base-card.component';
import { ChartProviderService } from '../shared/services/chart-provider.service';
import { ChartTypes } from '../shared/constants/chart-types.enum';

@Component({
  selector: 'app-arc-card',
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './arc-card.component.html',
  styleUrl: './arc-card.component.scss',
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({
        echarts: () => import('echarts')
      })
    }
  ]
})
export class ArcCardComponent extends BaseCardComponent implements OnChanges {
  @Input() filterParams: FilterParams = new FilterParams();

  arcStatusStatOptions: any;
  arcApprovalTypeOnlineStatOptions: any;
  arcApprovalTypeOfflineStatOptions: any;


  totalArc: number = 0;
  totalFilteredArc: number = 0;

  filterFlagOn: boolean = false;

  constructor(private http: HttpClient,
    private chartProviderService: ChartProviderService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {

    const allFiltersAreAll = this.filterParams.selectedLobt === 'All' &&
      this.filterParams.selectedApplication === 'All' &&
      this.filterParams.selectedStartDate === 'All' &&
      this.filterParams.selectedEndDate === 'All';

    if (allFiltersAreAll) {
      this.filterFlagOn = false;
      this.initLoadCharts()
      return;
    }

    if (changes['filterParams']) {
      this.filterFlagOn = true;
      this.updateChart();
    }
  }

  ngOnInit(): void {
    this.initLoadCharts
  }

  initLoadCharts() {
    this.http.get('/assets/aggr-data.json').subscribe((payload: any) => {
      const totalSummaryMap = payload.data.arc["TOTAL-SUMMARY"];
      this.totalArc = totalSummaryMap["TOTAL"];
      this.arcStatusStatOptions = this.chartProviderService.getChart(ChartTypes.ARC_TOTAL, totalSummaryMap);
      this.arcApprovalTypeOnlineStatOptions = this.chartProviderService.getChart(ChartTypes.ARC_ONLINE, totalSummaryMap);
      this.arcApprovalTypeOfflineStatOptions = this.chartProviderService.getChart(ChartTypes.ARC_OFFLINE, totalSummaryMap);
    });
  }

  updateChart() {
    // Fetch the data and update the chart based on the filterParams
    this.http.get('/assets/aggr-data.json').subscribe((payload: any) => {
      // Implement the logic to filter the data based on filterParams and update the chartData
      console.log(':::>>> Filter Params:', this.filterParams);

      // Concatenate only if a parameter is not "All"
      let prefix = '';
      if (this.filterParams.selectedLobt !== 'All') {
        prefix += `${this.filterParams.selectedLobt}#`;
      }
      if (this.filterParams.selectedApplication !== 'All') {
        prefix += `${this.filterParams.selectedApplication}#`;
      }

      // First pass to get the matching keys
      const matchingKeys = this.getMatchingKeys(payload.data.arc, prefix);
      let valueMap = this.getValueMap(payload.data.arc, matchingKeys);

      let startDate = '';
      let endDate = '';
      if (this.filterParams.selectedStartDate !== 'All') {
        startDate = this.filterParams.selectedStartDate;
        endDate = this.getCurrMonthYear();
      }
      if (this.filterParams.selectedEndDate !== 'All') {
        if (startDate.trim() == '') {
          startDate = '2024-Jan';
        }
        endDate = this.filterParams.selectedEndDate;
      }

      if (startDate.trim() != '' && endDate.trim() != '') {
        // Generate the missing months
        const missingMonths = this.generateMissingMonths(startDate, endDate);
        valueMap = this.filterValueMapByMissingMonths(valueMap, missingMonths);
      }

      const accumMap = this.accumulateValues(valueMap);
      this.totalFilteredArc = accumMap['TOTAL'] ?? 0;

      this.arcStatusStatOptions = this.chartProviderService.getChart(ChartTypes.ARC_TOTAL, accumMap);
      this.arcApprovalTypeOnlineStatOptions = this.chartProviderService.getChart(ChartTypes.ARC_ONLINE, accumMap);
      this.arcApprovalTypeOfflineStatOptions = this.chartProviderService.getChart(ChartTypes.ARC_OFFLINE, accumMap);
    });
  }

}
