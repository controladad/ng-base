const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'apps/**/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'libs/**/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'plugins/**/src/**/!(*.stories|*.spec).{ts,html}'),
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [
    require('./libs/base/src/configs/tailwind'),
    // require('@cac/base/tailwind'),
  ],
};
