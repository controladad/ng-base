import { AsyncPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnChanges, SimpleChanges, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable, of, startWith, Subscription } from 'rxjs';
import { ItemRecord, ItemRecords$ } from '../../../../core';
import { formControl, FormControlExtended } from '@al00x/forms';

// TODO: UPDATE THIS COMPONENT
// it has signal problem, and it isn't using our ui-checkbox
// or at least sharing the styles with ui-checkbox.
// it should be like ui-chips-group in implementation

@Component({
  selector: 'cac-checkbox-group',
  standalone: true,
  imports: [MatCheckboxModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CacCheckboxGroupComponent<T extends string | number> implements OnChanges, OnDestroy {
  readonly ERROR_TEXT = 'Select at least one item';

  @Input('items') rawItems?: ItemRecords$<T>;
  @Input() control: FormControlExtended = formControl(undefined);
  @Input() label?: string;

  checkedItems: { [p: string | number]: boolean } = {};
  isRequired = signal(false);
  items = signal<ItemRecord<T>[] | undefined>(undefined);

  private controlSubs = new Subscription();
  private itemsSubs = new Subscription();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['control']) {
      this.isRequired.set(this.control.hasValidator(Validators.required));
      this.controlSubs = new Subscription();
      this.controlSubs.add(
        this.control.valueChanges.pipe(startWith(this.control.value)).subscribe(() => {
          this.checkedDefaultClicked();
        }),
      );
    }
    if (changes['rawItems']) {
      this.itemsSubs?.unsubscribe();
      this.itemsSubs = (
        (this.rawItems === undefined
          ? of(undefined)
          : this.rawItems instanceof Array
          ? of(this.rawItems)
          : this.rawItems) as Observable<ItemRecord<T>[] | undefined>
      ).subscribe((items) => {
        this.items.set(items);
      });
    }
  }

  ngOnDestroy(): void {
    this.controlSubs.unsubscribe();
    this.itemsSubs.unsubscribe();
  }

  onChangeItem() {
    // if (event.checked) {
    //   this.checkedItems.push(event.source.value);
    // } else {
    //   this.checkedItems = this.checkedItems.filter((item) => item !== event.source.value);
    // }
    // this.control.setValue(this.checkedItems);
  }

  private checkedDefaultClicked() {
    // this.checkedItems = [];
    // items.map((item: any) => this.checkedItems.push(item.toString()));
  }
}
