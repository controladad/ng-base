import { Component, inject, input, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MfPluginsService } from '@mf';
import { take } from 'rxjs';
import { DashboardFilterChangeEvent, DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';
import { BarChartComponent } from '../bar-chart';
import { DoughnutChartComponent } from '../doughnut-chart';
import { DashboardApiService, DashboardChart, DashboardFilter } from '../../../../core';
import { DashboardBillStatusValues, ShipmentOrderContractTypeValues } from '../../../data';

@Component({
  selector: 'feature-dashboard',
  standalone: true,
  imports: [DashboardFilterComponent, BarChartComponent, DoughnutChartComponent, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private dashboardApiService = inject(DashboardApiService);
  private plugins = inject(MfPluginsService);

  type = input.required<'mainBills' | 'otherBills' | 'traffic'>();
  charts = signal<DashboardChart[]>([]);
  isLoading = signal(true);

  onFilterChange(e: DashboardFilterChangeEvent) {
    this.getDashboard(e);
  }

  getDashboard(e: DashboardFilterChangeEvent) {
    const filter: DashboardFilter = {
      startTime: e.startDate,
      endTime: e.endDate || null,
      branchIds: e.branchIds || [],
    } as DashboardFilter;

    switch (this.type()) {
      case 'mainBills':
        this.dashboardApiService
          .getBillsDashboard(filter)
          .pipe(take(1))
          .subscribe((result) => {
            this.charts.set([
              {
                title: 'تحویل به هر انتظامات (دفعه)',
                description: '(به تفکیک کاربر)',
                barChart: this.convertToBarChartData(
                  result.entezamatDeliveryCount,
                  'entezamatName',
                  'userDeliveryList',
                  'userName',
                  'delivery',
                ),
                hidden: !this.plugins.isEntezamatAvailable(),
              },
              {
                title: 'تحویل به هر انتظامات (کیلوگرم)',
                description: '(به تفکیک کاربر)',
                barChart: this.convertToBarChartData(
                  result.entezamatDeliveryKG,
                  'entezamatName',
                  'userDeliveryList',
                  'userName',
                  'delivery',
                ),
                hidden: !this.plugins.isEntezamatAvailable(),
              },
              {
                title: 'توزین هر باسکول (دفعه)',
                description: '(به تفکیک کاربر)',
                barChart: this.convertToBarChartData(
                  result.weighbridgeDeliveryCount,
                  'weighingStationName',
                  'userList',
                  'userName',
                  'weighing',
                ),
              },
              {
                title: 'توزین هر باسکول (کیلوگرم)',
                description: '(به تفکیک کاربر)',
                barChart: this.convertToBarChartData(
                  result.weighbridgeDeliveryKG,
                  'weighingStationName',
                  'userList',
                  'userName',
                  'weighing',
                ),
              },
              {
                title: 'تعداد بار حمل شده هر راننده',
                barChart: this.convertToBarChartData(
                  result.countLoadsCarriedByDriver,
                  'companyName',
                  'drivers',
                  'driverName',
                  'loadsCarried',
                ),
              },
              {
                title: 'تناژ بار حمل شده هر راننده',
                barChart: this.convertToBarChartData(
                  result.tonnageLoadsCarriedByDriver,
                  'companyName',
                  'drivers',
                  'driverName',
                  'loadsCarried',
                ),
              },
              {
                title: 'تعداد بار حمل شده هر شرکت ',
                description: '(به تفکیک وضعیت تاخیر)',
                barChart: this.convertToBarChartData(
                  result.countLoadCarriedWithDelay,
                  'companyName',
                  'delay',
                  'isDelayed',
                  'countLoadCarried',
                  'تاخیر',
                ),
              },
              {
                title: 'تناژ بار حمل شده هر شرکت ',
                description: '(به تفکیک دستور حمل)',
                barChart: this.convertToBarChartData(
                  result.tonnageLoadCarriedWithShipmentOrder,
                  'companyName',
                  'shipmentOrders',
                  'shipmentOrderName',
                  'tonnageLoadCarried',
                ),
              },
              {
                title: 'بار حمل شده هر شعبه ',
                description: '(به تفکیک شرکت)',
                barChart: this.convertToBarChartData(
                  result.countLoadCarriedWithCompany,
                  'branchName',
                  'companys',
                  'companyName',
                  'tonnageLoadCarried',
                ),
              },
              {
                title: 'قلم کالای حمل شده',
                doughnutChart: {
                  data: result.itemCarried.map((x) => ({ label: x.itrmName, value: x.itemCarried })),
                },
              },
              {
                title: 'قبوض',
                doughnutChart: {
                  data: result.billsWithStatus.map((x) => ({
                    label: DashboardBillStatusValues.find((s) => s.value === x.status)?.label || x.status,
                    value: x.count,
                  })),
                },
              },
            ]);
            this.isLoading.set(false);
          });
        break;
      case 'otherBills':
        this.dashboardApiService
          .getOtherItemBillsDashboard(filter)
          .pipe(take(1))
          .subscribe((result) => {
            this.charts.set([
              {
                title: 'توزین هر باسکول (دفعه)',
                description: '(به تفکیک کاربر)',
                barChart: this.convertToBarChartData(
                  result.weighbridgeDeliveryCount,
                  'weighingStationName',
                  'userList',
                  'userName',
                  'weighing',
                ),
              },
              {
                title: 'توزین هر باسکول (کیلوگرم)',
                description: '(به تفکیک کاربر)',
                barChart: this.convertToBarChartData(
                  result.weighbridgeDeliveryKG,
                  'weighingStationName',
                  'userList',
                  'userName',
                  'weighing',
                ),
              },
              {
                title: 'تعداد بار حمل شده هر راننده',
                barChart: this.convertToBarChartData(
                  result.countLoadsCarriedByDriver,
                  'companyName',
                  'drivers',
                  'driverName',
                  'loadsCarried',
                ),
              },
              {
                title: 'تناژ بار حمل شده هر راننده',
                barChart: this.convertToBarChartData(
                  result.tonnageLoadsCarriedByDriver,
                  'companyName',
                  'drivers',
                  'driverName',
                  'loadsCarried',
                ),
              },
              {
                title: 'بار حمل شده از هر قلم کالا ',
                description: '(به تفکیک شرکت)',
                barChart: this.convertToBarChartData(
                  result.countLoadsCarriedOfItemWithCompany,
                  'itemName',
                  'companys',
                  'companyName',
                  'tonnageLoadCarried',
                ),
              },
              {
                title: 'بار حمل شده از هر قلم کالا ',
                description: '(به تفکیک شعبه)',
                barChart: this.convertToBarChartData(
                  result.countLoadsCarriedOfItemWithBranch,
                  'itemName',
                  'branchs',
                  'branchName',
                  'tonnageLoadCarried',
                ),
              },
              {
                title: 'بار حمل شده هر شعبه ',
                description: '(به تفکیک شرکت)',
                barChart: this.convertToBarChartData(
                  result.countLoadCarriedWithCompany,
                  'branchName',
                  'companys',
                  'companyName',
                  'tonnageLoadCarried',
                ),
              },
            ]);
            this.isLoading.set(false);
          });
        break;
      case 'traffic':
        this.dashboardApiService
          .getTrafficDashboard(filter)
          .pipe(take(1))
          .subscribe((result) => {
            this.charts.set([
              {
                title: 'تردد هر نوع قرارداد',
                doughnutChart: {
                  data: result.trafficOfAnyContractType.map((x) => ({
                    label:
                      ShipmentOrderContractTypeValues.find((s) => x.contractType === s.value)?.label || x.contractType,
                    value: x.count,
                  })),
                },
              },
              {
                title: 'ثبت تردد هر کاربر',
                description: '(به تفکیک نوع)',
                barChart: this.convertToBarChartData(
                  result.registerOfTrafficByUser.map((a) => ({
                    ...a,
                    typeOfTraffic: a.typeOfTraffic.map((b) => ({
                      ...b,
                      shipmentOrderType: b.shipmentOrderType === 'Input' ? 'ورودی' : 'خروجی',
                    })),
                  })),
                  'userName',
                  'typeOfTraffic',
                  'shipmentOrderType',
                  'count',
                ),
              },
              {
                title: 'تردد هر شعبه ',
                description: '(به تفکیک شرکت)',
                barChart: this.convertToBarChartData(
                  result.trafficInBranchByCompany,
                  'branchName',
                  'companys',
                  'companyName',
                  'count',
                ),
              },
            ]);
            this.isLoading.set(false);
          });
        break;
      default:
        this.isLoading.set(false);
        break;
    }
  }

  convertToBarChartData(
    arr: any[],
    labelProp: string,
    arrayProp: string,
    keyProp: string,
    valueProp: string,
    booleanKeyTitle?: string,
  ) {
    const keys: string[] = [];
    arr.forEach((a: any) => {
      a[arrayProp].forEach((item: any, i: number) => {
        const key = item[keyProp] || item[keyProp] === false ? item[keyProp] : i;
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
    });

    const data = keys.map((key, i) => {
      const d = arr.map((a) => {
        const x = typeof key === 'number' ? a[arrayProp][i] : a[arrayProp].find((s: any) => s[keyProp] === key);
        return x ? x[valueProp] : 0;
      });
      return {
        label:
          typeof key === 'boolean' && booleanKeyTitle
            ? key === true
              ? `با ${booleanKeyTitle}`
              : `بدون ${booleanKeyTitle}`
            : typeof key === 'number'
              ? 'بدون عنوان'
              : key,
        data: d,
      };
    });

    return {
      labels: arr.map((x) => x[labelProp] || 'بدون عنوان'),
      data: data,
    };
  }
}
