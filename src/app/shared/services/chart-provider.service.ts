import { Injectable } from '@angular/core';
import { ChartTypes } from '../constants/chart-types.enum';
import { CoeCardComponent } from '../../coe-card/coe-card.component';
import { DeviationCardComponent } from '../../deviation-card/deviation-card.component';
import { ActionCardComponent } from '../../action-card/action-card.component';
import { ArcCardComponent } from '../../arc-card/arc-card.component';

@Injectable({
    providedIn: 'root'
})
export class ChartProviderService {
    constructor() { }

    getChart(chartType: ChartTypes, data: any): any {

        if (chartType === ChartTypes.ACTION_ITEM_STATUS ||
            chartType === ChartTypes.DEVIATION_ITEM_STATUS ||
            chartType === ChartTypes.COE_ITEM_STATUS) {
            return this.getItemStatusChart(data);
        } else if (chartType === ChartTypes.ACTION_ITEM_AGEING ||
            chartType === ChartTypes.DEVIATION_ITEM_AGEING ||
            chartType === ChartTypes.COE_ITEM_AGEING) {
            return this.getItemAgeingChart(data);
        } else if (chartType === ChartTypes.ARC_TOTAL) {
            return this.getArcTotalChart(data);
        } else if (chartType === ChartTypes.ARC_ONLINE) {
            return this.getArcOnlineChart(data);
        } else if (chartType === ChartTypes.ARC_OFFLINE) {
            return this.getArcOfflineChart(data);
        }

        return {};

    }

    getArcTotalChart(data: any) {
        const chartData = this.buildArcStausChartData(data);

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

    getArcOnlineChart(data: any) {
        const chartData = this.buildArcApprovalChartData(data, "Online");

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

    getArcOfflineChart(data: any) {
        const chartData = this.buildArcApprovalChartData(data, "Offline");

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

    getItemStatusChart(data: any) {

        const chartData = this.buildItemStatusChartData(data);

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
                        type: 'pie',
                        radius: ['50%', '60%'],
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

    getItemAgeingChart(data: any) {

        const chartData = this.buildItemStatusChartData(data);

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
                        type: 'pie',
                        radius: ['50%', '60%'],
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

    buildItemStatusChartData(data: any): any {

        const result = [];
        let total: number = data["TOTAL"];
        const colorMapping: { [key: string]: string } = {
            'In Progress': '#FF7E65',
            'To Do': '#D94164',
            'Completed': '#12CA98',
            'Review': '#FFB024',
        };

        const displayNameMapping: { [key: string]: string } = {
            'To Do': 'To Do',
            'In Progress': 'In Progress',
            'Completed': 'Completed',
            'Review': 'Review',
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

        return result;
    }

    buildItemAgeingChartData(data: any): any {

        const result = [];
        let total: number = data["TOTAL"];
        const colorMapping: { [key: string]: string } = {
            'Overdue': '#D94164',
            'Not Overdue': '#12CA98',
            'At Risk': '#FFB024',
        };

        const displayNameMapping: { [key: string]: string } = {
            'Overdue': 'Overdue',
            'Not Overdue': 'Not Overdue',
            'At Risk': 'At Risk',
        };



        for (const status in data) {

            if (status != 'TOTAL' && data.hasOwnProperty(status)) {
                const countValue = data[status];
                const displayName = displayNameMapping[status] || status;
                result.push({
                    value: countValue,
                    name: `${displayName}:${countValue}`,
                    itemStyle: {
                        color: colorMapping[status] || '#000000' // Default to black if no color is defined
                    }
                });
            }
        }

        return result
    }

    buildArcStausChartData(data: any): any {

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

        return result
    }

    buildArcApprovalChartData(data: any, approvalType: string): any {
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

        return result;
    }
}