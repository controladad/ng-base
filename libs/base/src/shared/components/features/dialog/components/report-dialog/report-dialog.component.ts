import { Component } from '@angular/core';
import { ReportDetailsComponent } from '../../../report-details';
import { DialogLayoutComponent } from '../../../../layouts';
import { BaseDialogComponent } from '../_base-dialog.component';

export interface ReportDialogData {
  data: any;
}

@Component({
  selector: 'feature-report-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, ReportDetailsComponent],
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.scss',
})
export class ReportDialogComponent extends BaseDialogComponent<ReportDialogData, null> {}
