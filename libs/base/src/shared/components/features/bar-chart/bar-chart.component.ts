import { Component, computed, input, Signal } from '@angular/core';
import { BarChartData } from '@base';
import { ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'feature-bar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {
  data = input.required<BarChartData>();
  chartData: Signal<ChartData<'bar', number[], string> | undefined> = computed(() => ({
    labels: this.data().labels,
    datasets:
      this.data().data?.map((d) => ({
        label: d.label,
        data: d.data,
        borderRadius: 4,
        barThickness: 24,
      })) || [],
  }));
  readonly chartOptions: ChartOptions<'bar'> = {
    scales: {
      x: {
        stacked: true,
        reverse: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback(tickValue) {
            const value = +(tickValue || 0);
            return value === 0 ? 0 : value && value % 10000 === 0 ? `${value / 1000}K` : value;
          },
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: { top: 32 },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        textAlign: 'center',
        font: { weight: 500 },
        formatter: (value: number, ctx: any) => {
          const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
          return total ?? 0;
        },
        display: (ctx: any) => {
          return ctx.datasetIndex === ctx.chart.$totalizer.utmost;
        },
      },
    },
  } as ChartOptions<'bar'>;
}
