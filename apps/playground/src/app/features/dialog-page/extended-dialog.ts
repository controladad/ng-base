import { Injectable } from '@angular/core';
import { DialogService } from '@controladad/ng-base';

@Injectable({
  providedIn: 'root',
})
export class ExtendedDialog extends DialogService {
  something(p: string) {
    return super.prompt({
      title: 'LOOOK',
      message: 'SOMETHING!!',
    });
  }
  something2(t: any, b: any) {
    return super.prompt({
      title: 'LOOOK',
      message: 'SOMETHING!!',
    });
  }
  something3(x: number) {
    return super.prompt({
      title: 'LOOOK',
      message: 'SOMETHING!!',
    });
  }
}
