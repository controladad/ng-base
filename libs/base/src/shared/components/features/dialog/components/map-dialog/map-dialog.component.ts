import { Component } from '@angular/core';
import { DialogLayoutComponent } from '../../../../layouts';
import { MapComponent, MapRoute } from '../../../map';
import { BaseDialogComponent } from '../_base-dialog.component';

export type MapDialogData = MapRoute;

export interface MapDialogResult {
  result: string;
}

@Component({
  selector: 'feature-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrl: './map-dialog.component.scss',
  standalone: true,
  imports: [MapComponent, DialogLayoutComponent],
})
export class MapDialogComponent extends BaseDialogComponent<MapDialogData, MapDialogResult> {}
