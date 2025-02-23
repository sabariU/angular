import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FilterParams } from '../model/filter.params.model';

@Component({
  selector: 'app-donut-chart',
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({
        echarts: () => import('echarts')
      })
    }
  ]
})
export class DonutChartComponent implements OnChanges {
  @Input() filterParams: FilterParams = new FilterParams();

  arcStatusStatOptions: any;
  arcApprovalTypeOnlineStatOptions: any;
  arcApprovalTypeOfflineStatOptions: any;
  arcChartOptions: any;
  coeChartOptions: any;
  actionChartOptions: any;
  deviationChartOptions: any;

  totalArc: number = 0;
  totalFilteredArc: number = 0;

  chartOptions: any;
  filterFlagOn: boolean = false;


  constructor(private http: HttpClient) { }

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


  updateChart() {
    console.log(':::>>> Updating chart with Filter Params:', this.filterParams);
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
        if (startDate.trim() == ''){
          startDate = '2024-Jan';
        }
        endDate = this.filterParams.selectedEndDate;
      }

      if(startDate.trim() != '' && endDate.trim() != ''){
        // Generate the missing months
        const missingMonths = this.generateMissingMonths(startDate, endDate);
        valueMap = this.filterValueMapByMissingMonths(valueMap, missingMonths);
      }

      const accumMap = this.accumulateValues(valueMap);
      this.totalFilteredArc = accumMap['TOTAL'];
      this.arcStatusStatOptions = this.createStatusStats(accumMap);

      this.arcApprovalTypeOnlineStatOptions = this.createApprovalTypeOptions(accumMap, "Online");
      this.arcApprovalTypeOfflineStatOptions = this.createApprovalTypeOptions(accumMap, "Offline");
     
    });
  }


  generateMissingMonths(startDate: string, endDate: string): Set<string> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startParts = startDate.split('-');
    const endParts = endDate.split('-');
    const startYear = parseInt(startParts[0], 10);
    const startMonth = months.indexOf(startParts[1]);
    const endYear = parseInt(endParts[0], 10);
    const endMonth = months.indexOf(endParts[1]);

    const result = new Set<string>();
    for (let year = startYear; year <= endYear; year++) {
      const start = year === startYear ? startMonth : 0;
      const end = year === endYear ? endMonth : 11;
      for (let month = start; month <= end; month++) {
        result.add(`${year}-${months[month]}`);
      }
    }
    return result;
  }

  getCurrMonthYear(): string {
    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
    const currentYear = currentDate.getFullYear();
    return `${currentYear}-${currentMonth}`;
  }

  filterValueMapByMissingMonths(valueMap: { [key: string]: any }, missingMonths: Set<string>): { [key: string]: any } {
    const filteredValueMap: { [key: string]: any } = {};

    for (const key in valueMap) {
      if (valueMap.hasOwnProperty(key)) {
        for (const month of missingMonths) {
          console.log('### Key Month :', month);
          if (key.endsWith(month)) {
            filteredValueMap[key] = valueMap[key];
            break; // No need to check other months if one matches
          }
        }
      }
    }

    return filteredValueMap;
  }

  getMatchingKeys(data: any, prefix: string): Set<string> {
    const matchingKeys = new Set<string>();

    for (const key in data) {
      if (data.hasOwnProperty(key) && key.startsWith(prefix)) {
        matchingKeys.add(key);
      }
    }

    return matchingKeys;
  }

  getMatchingKeys1(data: any, prefixSet: Set<string>): Set<string> {
    const matchingKeys = new Set<string>();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        for (const prefix of prefixSet) {
          if (key.startsWith(prefix)) {
            matchingKeys.add(key);
            break; // No need to check other prefixes if one matches
          }
        }
      }
    }

    return matchingKeys;
  }

  getValueMap(data: any, keys: Set<string>): any {
    const valueMap: { [key: string]: number } = {};

    keys.forEach(key => {
      if (data.hasOwnProperty(key)) {
        valueMap[key] = data[key];
      }
    });
    return valueMap;
  }

  sumValues(valueMap: any): number {
    let total = 0;

    for (const key in valueMap) {
      if (valueMap.hasOwnProperty(key)) {
        const item = valueMap[key];
        for (const subKey in item) {
          if (item.hasOwnProperty(subKey) && typeof item[subKey] === 'number') {
            total += item[subKey];
          }
        }
      }
    }

    return total;
  }

  accumulateValues(valueMap: { [key: string]: any }): { [key: string]: number } {
    const accumulatedMap: { [key: string]: number } = {};

    for (const key in valueMap) {
      if (valueMap.hasOwnProperty(key)) {
        const item = valueMap[key];
        for (const subKey in item) {
          if (item.hasOwnProperty(subKey) && typeof item[subKey] === 'number') {
            if (!accumulatedMap.hasOwnProperty(subKey)) {
              accumulatedMap[subKey] = 0;
            }
            accumulatedMap[subKey] += item[subKey];
          }
        }
      }
    }

    return accumulatedMap;
  }

  ngOnInit(): void {
    this.initLoadCharts
  }

  initLoadCharts() {
    this.http.get('/assets/aggr-data.json').subscribe((payload: any) => {
      const totalSummaryMap = payload.data.arc["TOTAL-SUMMARY"];
      this.totalArc = totalSummaryMap["TOTAL"];
      this.arcStatusStatOptions = this.createStatusStats(totalSummaryMap);
      this.arcApprovalTypeOnlineStatOptions = this.createApprovalTypeOptions(totalSummaryMap, "Online");
      this.arcApprovalTypeOfflineStatOptions = this.createApprovalTypeOptions(totalSummaryMap, "Offline");
      this.arcChartOptions = this.createChartOptions(payload.data.arc);
      this.coeChartOptions = this.createChartOptions(payload.data.coe);
      this.actionChartOptions = this.createChartOptions(payload.data.action);
      this.deviationChartOptions = this.createChartOptions(payload.data.deviation);
    });
  }

  createStatusStats(data: any): any {

    const result = [];
    let total: number = data["TOTAL"];
    const colorMapping: { [key: string]: string } = {
      'LOBT APP SHERPA REVIEW': '#FF7E65',
      'INITIAL REVIEW PREP': '#D94164',
      'Completed': '#12CA98',
      'ARC Review': '#76CAFF',
      'Cross-LOBT Sherpa Review': '#FFB024',
    };

    const displayNameMapping: { [key: string]: string } = {
      'LOBT APP SHERPA REVIEW': 'LOBT App Sherpas Reviews',
      'INITIAL REVIEW PREP': 'Initial Review',
      'Completed': 'Completed',
      'ARC Review': 'ARC Review',
      'Cross-LOBT Sherpa Review': 'Cross-LOBT Reviews',
    };



    for (const status in data) {

      if (status != 'TOTAL' &&
        !status.includes('#') && data.hasOwnProperty(status)) {
        const countValue = data[status];
        const percentage = Math.ceil((countValue / total) * 100);
        const displayName = displayNameMapping[status] || status;
        result.push({
          value: countValue,
          name: `${displayName}:${percentage}%:${countValue}`,
          itemStyle: {
            color: colorMapping[status] || '#000000' // Default to black if no color is defined
          }
        });
      }
    }

    console.log('Result :', result);
    return this.getDonutChartData(result);
  }

  createApprovalTypeOptions(data: any, approvalType: string): any {
    const result = [];
    let total: number = data["TOTAL"];
    const colorMapping: { [key: string]: string } = {
      'LOBT APP SHERPA REVIEW': '#FF7E65',
      'INITIAL REVIEW PREP': '#D94164',
      'Completed': '#12CA98',
      'ARC Review': '#76CAFF',
      'Cross-LOBT Sherpa Review': '#FFB024',
    };

    const displayNameMapping: { [key: string]: string } = {
      'LOBT APP SHERPA REVIEW': 'LOBT App Sherpas Reviews',
      'INITIAL REVIEW PREP': 'Initial Review',
      'Completed': 'Completed',
      'ARC Review': 'ARC Review',
      'Cross-LOBT Sherpa Review': 'Cross-LOBT Reviews',
    };



    for (const status in data) {

      if (status != 'TOTAL' &&
        status.includes('#' + approvalType) && data.hasOwnProperty(status)) {
        const statusTrimmed = status.replace('#' + approvalType, '');
        const countValue = data[status];
        const displayName = displayNameMapping[statusTrimmed] || status;
        result.push({
          value: countValue,
          name: `${displayName}:${countValue}`,
          itemStyle: {
            color: colorMapping[statusTrimmed] || '#000000' // Default to black if no color is defined
          }
        });
      }
    }

    return this.getDonutChartData1(result);
  }

  getDonutChartData(chartData: any): any {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'center',
        //left: 150,
        bottom: 0,
        formatter: (name: string) => {
          const parts = name.split(':');
          return `{name|${parts[0]}}  {percentage|${parts[1]}}  {value|${parts[2]}}`;
        },
        textStyle: {
          rich: {
            name: {
              width: 180, // Set a fixed width for the name column
              height: 22, // Set a fixed height for the name column
              padding: [2, 0, 2, 0], // Use array notation for padding (top, right, bottom, left)
              align: 'left'
            },
            percentage: {
              width: 30, // Set a fixed width for the name column
              height: 22,
              align: 'center'
            },
            value: {
              width: 40, // Set a fixed width for the name column
              height: 22,
              align: 'right'
            }
          }
        }
      },
      series: [
        {
          name: 'Status',
          type: 'pie',
          radius: ['20%', '40%'],
          avoidLabelOverlap: false,
          itemStyle: {

            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ]
    };
  }

  getDonutChartData1(chartData: any): any {

    if (!chartData || Object.keys(chartData).length === 0) {
      console.warn('No data available for pie chart');
      return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: 'Status',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }

    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: '10',
        top: 'middle',
        formatter: (name: string) => {
          const parts = name.split(':');
          return `{name|${parts[0]}}  {percentage|${parts[1]}}`;
        },
        textStyle: {
          rich: {
            name: {
              width: 180, // Set a fixed width for the name column
              height: 22, // Set a fixed height for the name column
              padding: [2, 0, 2, 0], // Use array notation for padding (top, right, bottom, left)
              align: 'left'
            },
            percentage: {
              width: 30, // Set a fixed width for the name column
              height: 22,
              align: 'center'
            },
            value: {
              width: 40, // Set a fixed width for the name column
              height: 22,
              align: 'right'
            }
          }
        }
      },
      series: [
        {
          name: 'Status',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          right: '60%',
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ]
    };
  }

  createChartOptions(data: any): any {
    const chartData = this.transformData(data);
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Status',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '10',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ]
    };
  }

  transformData(data: any): any[] {
    const result = [];
    // for (const key in data) {
    //   if (data.hasOwnProperty(key)) {
    //     const item = data[key];
    //     for (const status in item) {
    //       if (status !== 'TOTAL' && item.hasOwnProperty(status)) {
    //         result.push({ value: item[status], name: status });
    //       }
    //     }
    //   }
    // }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const item = data[key];
        for (const status in item) {
          if (status == 'TOTAL-SUMMARY') {
            result.push({ value: item[status], name: status });
          }
        }
      }
    }
    return result;
  }
}