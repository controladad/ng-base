import { Component } from '@angular/core';
import { SectionComponent } from '../../section.component';
import { CacCheckboxComponent, CacCheckboxGroupComponent, ItemRecord } from '@controladad/ng-base';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [SectionComponent, CacCheckboxComponent, CacCheckboxGroupComponent],
  templateUrl: './checkbox-page.component.html',
  styleUrl: './checkbox-page.component.scss',
})
export class CheckboxPageComponent {
  items: ItemRecord<string>[] = [
    { label: 'Label1', value: 'a', },
    { label: 'Label2', value: 'b', },
    { label: 'Label3', value: 'c', },
    { label: 'Label4', value: 'd', },
  ]
}
