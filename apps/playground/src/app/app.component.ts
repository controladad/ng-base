import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DriverRepository } from './repositories/driver.repository';
import { ExtendedDialog } from './features/dialog-page/extended-dialog';
import { DateFns } from '@controladad/ng-base';
import { formControl, Validators } from '@al00x/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [RouterModule, ReactiveFormsModule, AsyncPipe],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'playground';

  control = formControl('', Validators.required);

  constructor() {
    DriverRepository.init();
    dialog$ = inject(ExtendedDialog);

    console.log(DateFns().format(new Date(), 'yyyy-MM-dd'));

    snackbar$.error(
      "!!!FAKE ERROR!!! JSON deserialization for type 'Application.Queries.LoginAndRegister.AdminLoginRequest' was missing required properties including: 'email'.",
      {
        duration: 999999,
      },
    );

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
