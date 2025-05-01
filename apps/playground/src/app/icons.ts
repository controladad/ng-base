export const icons = ['something', 'test-test', 'extending-icons'] as const;

declare module '@controladad/ng-base' {
  interface IconsOverride extends Record<(typeof icons)[number], any> {}
}
