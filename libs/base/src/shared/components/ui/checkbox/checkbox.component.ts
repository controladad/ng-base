import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { formControl } from '@al00x/forms';

@Component({
  selector: 'cac-checkbox',
  standalone: true,
  imports: [MatCheckboxModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CacCheckboxComponent implements OnChanges {
  @Input() control = formControl(false);
  @Input() label?: string;
  @Input() checked = this.control.value;
  @Input() indeterminate = false;
  @Output() onChange = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['checked']) {
      this.control.setValue(this.checked);
    }
  }
}
