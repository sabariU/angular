import { Component } from '@angular/core';

@Component({
    template: ''
})
export class BaseCardComponent {
    constructor() { }

    getMatchingKeys(data: any, prefix: string): Set<string> {
        const matchingKeys = new Set<string>();

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.startsWith(prefix)) {
                matchingKeys.add(key);
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
}