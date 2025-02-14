import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DriverRepository } from './repositories/driver.repository';
import { ExtendedDialog } from './features/dialog-page/extended-dialog';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'playground';

  constructor() {
    DriverRepository.init();
    dialog$ = inject(ExtendedDialog);

    // dialog$.prompt({ title: 'Hello', message: 'Yo!' })

    // setTimeout(() => {
    //   DriverRepository.api.getAll().subscribe((v) => {
    //     console.log(v);
    //     DriverRepository.dialog(v[1])
    //       .afterClosed()
    //       .subscribe(() => {
    //         DriverRepository.dialog(v[2])
    //           .afterClosed()
    //           .subscribe(() => {
    //             DriverRepository.dialog()
    //           });
    //       });
    //   });
    // }, 500);
  }
}
