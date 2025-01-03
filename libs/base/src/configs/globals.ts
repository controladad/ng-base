import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogService, SnackbarService } from '../shared';
import { enableElfProdMode } from '@ngneat/elf';

export function setupGlobalServices() {
  (globalThis as any).dialog$ = inject(DialogService);
  (globalThis as any).snackbar$ = inject(SnackbarService);
  (globalThis as any).http$ = inject(HttpClient);
}

export function setupProdMode(prod: boolean) {
  if (!prod) return;

  enableElfProdMode();
}

declare global {
  let dialog$: DialogService;
  let snackbar$: SnackbarService;
  let http$: HttpClient;
}
