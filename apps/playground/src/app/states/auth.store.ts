import { AuthBaseStore, AuthBaseStoreLoginModel, AuthBaseStoreProps } from '@controladad/ng-base';
import { of, tap } from 'rxjs';
import { Injectable } from '@angular/core';

interface AuthStoreProps extends AuthBaseStoreProps<any> {}
interface AuthStoreLoginModel extends AuthBaseStoreLoginModel {}

@Injectable({
  providedIn: 'root',
})
export class AuthStore extends AuthBaseStore<AuthStoreProps, AuthStoreLoginModel> {
  constructor() {
    super({
      loginApi: () => of({} as any).pipe(tap(() => console.log('HOOP!'))),
    });
  }

  override login(model: AuthStoreLoginModel) {
    return of({} as any).pipe(tap(() => console.log('HOOP!')))
    // return super.login(model);
  }
}
