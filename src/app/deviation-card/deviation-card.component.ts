import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { FilterParams } from '../model/filter.params.model';
import { HttpClient } from '@angular/common/http';
import { ChartProviderService } from '../shared/services/chart-provider.service';
import { ChartTypes } from '../shared/constants/chart-types.enum';
import { BaseCardComponent } from '../shared/base/base-card.component';

@Component({
  selector: 'app-deviation-card',
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './deviation-card.component.html',
  styleUrl: './deviation-card.component.scss',
    providers: [
      {
        provide: NGX_ECHARTS_CONFIG,
        useFactory: () => ({
          echarts: () => import('echarts')
        })
      }]
})
export class DeviationCardComponent extends BaseCardComponent implements OnChanges {

  @Input() filterParams: FilterParams = new FilterParams();

  deviationStatusStatOptions: any;
  deviationAgeingStatOptions: any;


  totalDeviation: number = 0;
  totalOverdue: number = 0;
  totalFiltered: number = 0;

  filterFlagOn: boolean = false;

  constructor(private http: HttpClient, private chartProviderService: ChartProviderService) {
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
      const totalSummaryMap = payload.data.deviation["TOTAL-SUMMARY"];
      this.totalDeviation = totalSummaryMap["TOTAL"];
      this.deviationStatusStatOptions = this.chartProviderService.getChart(ChartTypes.ACTION_ITEM_STATUS, totalSummaryMap);
      this.deviationAgeingStatOptions = this.chartProviderService.getChart(ChartTypes.ACTION_ITEM_AGEING, totalSummaryMap);
      });
  }

  updateChart() {
    // Fetch the data and update the chart based on the filterParams
    this.http.get('/assets/aggr-data.json').subscribe((payload: any) => {
      // Implement the logic to filter the data based on filterParams and update the chartData
      // Concatenate only if a parameter is not "All"
      let prefix = '';
      if (this.filterParams.selectedLobt !== 'All') {
        prefix += `${this.filterParams.selectedLobt}#`;
      }
      if (this.filterParams.selectedApplication !== 'All') {
        prefix += `${this.filterParams.selectedApplication}#`;
      }

      // First pass to get the matching keys
      const matchingKeys = this.getMatchingKeys(payload.data.deviation, prefix);
      let valueMap = this.getValueMap(payload.data.deviation, matchingKeys);

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
      this.totalFiltered = accumMap['TOTAL'] ?? 0;

      this.deviationStatusStatOptions = this.chartProviderService.getChart(ChartTypes.ACTION_ITEM_STATUS, accumMap);
      this.deviationAgeingStatOptions = this.chartProviderService.getChart(ChartTypes.ACTION_ITEM_AGEING, accumMap);

    });
  }

}
