import { Component } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import { DialogLayoutComponent } from '../../../../layouts';
import { IconComponent, LicensePlateComponent } from '../../../../ui';
import { NgTemplateOutlet } from '@angular/common';
import { VehicleDetails } from '../../../../../../core';
import { ShipmentOrderContractTypeValues } from '../../../../../../shared/data';

export type VehicleInfoDialogData = VehicleDetails;

export type VehicleInfoDialogResult = boolean;

@Component({
  selector: 'feature-vehicle-info-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, LicensePlateComponent, NgTemplateOutlet, IconComponent, LicensePlateComponent],
  templateUrl: './vehicle-info-dialog.component.html',
  styleUrl: './vehicle-info-dialog.component.scss',
})
export class VehicleInfoDialogComponent extends BaseDialogComponent<VehicleInfoDialogData, VehicleInfoDialogResult> {
  branches = this.data.branches.map((x) => x.name).join(', ');
  contract =
    ShipmentOrderContractTypeValues.find((x) => x.value === this.data.contractType)?.label ?? this.data.contractType;
}
