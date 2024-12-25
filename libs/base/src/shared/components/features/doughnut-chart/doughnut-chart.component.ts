import { AfterViewInit, Component, ElementRef, Signal, ViewChild, computed, input, signal } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { DoughnutChartData } from '@base';
@Component({
  selector: 'feature-doughnut-chart',
  standalone: true,
  imports: [BaseChartDirective, DecimalPipe],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.scss',
})
export class DoughnutChartComponent implements AfterViewInit {
  @ViewChild('Legends') legendsContainer!: ElementRef<HTMLElement>;
  data = input.required<DoughnutChartData>();
  chartData: Signal<ChartData<'doughnut', number[], string> | undefined> = computed(() => ({
    labels: this.data().data?.map((t) => t.label) ?? [],
    datasets: [
      {
        label: 'کیلو گرم',
        borderRadius: 8,
        data: this.data().data.map((t) => t.value) ?? [],
      },
    ],
  }));
  total = computed(() => this.data().data.reduce((a, b) => a + b.value, 0) ?? 0);
  chartOptions = signal<ChartOptions<'doughnut'>>({});

  readonly defaultOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        display: false,
        position: 'right',
        labels: {
          generateLabels: (chart: any) => {
            const labels = (chart.data.labels ?? []) as string[];
            const dataset = chart.data.datasets.at(0);
            return (labels ?? []).map((label, index) => {
              const value = dataset?.data?.at(index);
              const bgColor = (dataset?.backgroundColor as string[])?.at(index);
              return {
                text: `${label.padEnd(36)} ${value} ${''.padEnd(30)}`,
                fillStyle: bgColor,
                lineWidth: 0,
              };
            });
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
  } as ChartOptions<'doughnut'>;

  ngAfterViewInit() {
    this.chartOptions.update((chart) => {
      chart = { ...this.defaultOptions };

      if (!chart.plugins) {
        chart.plugins = {};
      }
      if (!chart.plugins.legend) {
        chart.plugins.legend = {};
      }

      chart.plugins.legend = { display: false };

      (chart.plugins as any)['htmlLegend'] = {
        element: this.legendsContainer.nativeElement,
      };

      return chart;
    });
  }
}
