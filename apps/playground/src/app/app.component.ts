import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DriverRepository } from './repositories/driver.repository';

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
