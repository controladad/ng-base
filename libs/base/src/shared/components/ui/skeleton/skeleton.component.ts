import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'ui-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
})
export class SkeletonComponent {}
