import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FilterParams } from '../model/filter.params.model';

@Component({
  selector: 'app-top-filter',
  imports: [FormsModule, CommonModule],
  templateUrl: './top-filter.component.html',
  styleUrl: './top-filter.component.scss'
})
export class TopFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<FilterParams>();
  lobtOptions: string[] = [];
  applicationOptions: string[] = [];
  startDate: string[] = [];
  endDate: string[] = [];

  filterParams: FilterParams = new FilterParams();
  selectedLobt: string = this.lobtOptions[0];
  selectedApplication: string = this.applicationOptions[0];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.populateDateRange();
    this.http.get('/assets/aggr-data.json').subscribe((payload: any) => {
      const uniqueKeys = this.extractUniqueKeys(payload.data.arc);

      let lobtArr : string[] = []
      let applicationArr : string[] = []
      uniqueKeys.forEach(key => {
        const parts = key.split('#');
        if (parts.length >= 2) {
          if (parts[0].trim() !== '') {
            lobtArr.push(parts[0]);
          }
          if (parts[1].trim() !== '') {
            applicationArr.push(parts[1]);
          }
        }
      });
      lobtArr.sort();
      applicationArr.sort();

      lobtArr.unshift("All");
      applicationArr.unshift("All");

      // Remove duplicates by converting to a Set and back to an array
      this.lobtOptions = Array.from(new Set(lobtArr));
      this.applicationOptions = Array.from(new Set(applicationArr));

      if (this.lobtOptions.length > 0) {
        this.filterParams.selectedLobt = this.lobtOptions[0];
      }
      if (this.applicationOptions.length > 0) {
        this.filterParams.selectedApplication = this.applicationOptions[0];
      }
      if (this.startDate.length > 0) {
        this.filterParams.selectedStartDate = this.startDate[0];
      }
      if (this.endDate.length > 0) {
        this.filterParams.selectedEndDate = this.endDate[0];
      }

      this.emitFilterChange();

    });

    this.emitFilterChange();

  }

  populateDateRange() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startYear = 2024;
    const endYear = 2025;

    this.startDate.push("All");
    this.endDate.push("All");
    for (let year = startYear; year <= endYear; year++) {
      for (const month of months) {
        const dateStr = `${year}-${month}`;
        this.startDate.push(dateStr);
        this.endDate.push(dateStr);
      }
    }
  }

  extractUniqueKeys(data: any): string[] {
    const uniqueKeys = new Set<string>();

    for (const key in data) {
      if (data.hasOwnProperty(key) && key !== 'TOTAL-SUMMARY'
          && key.trim() !== '') {
        uniqueKeys.add(key);
      }
    }
    return Array.from(uniqueKeys).sort();
  }

  calculateTotalValue(data: any, selectedLobt: string) {
    let total = 0;

    for (const key in data) {
      if (data.hasOwnProperty(key) && key.startsWith(selectedLobt)) {
        total += data[key];
      }
    }

    //this.totalValue = total;
  }

  onLobtChange() {
    this.http.get('/assets/aggr-data.json').subscribe((data: any) => {
      this.calculateTotalValue(data, this.selectedLobt);
    });
  }

  onFilterChange() {
    this.emitFilterChange();
  }

  emitFilterChange() {
    const newFilterParams = new FilterParams();
    newFilterParams.selectedLobt = this.filterParams.selectedLobt;
    newFilterParams.selectedApplication = this.filterParams.selectedApplication;
    newFilterParams.selectedStartDate = this.filterParams.selectedStartDate;
    newFilterParams.selectedEndDate = this.filterParams.selectedEndDate;
    this.filterChange.emit(newFilterParams);
  }

}