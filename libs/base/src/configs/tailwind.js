// import { PluginCreator } from 'tailwindcss/types/config';
import plugin from 'tailwindcss/plugin';

const utility = ({ addUtilities, theme }) => {
  addUtilities({
    '.unicode-plain': {
      'unicode-bidi': 'plaintext',
    },
    '.unicode-normal': {
      'unicode-bidi': 'normal',
    },
  })
}

export default plugin((...e) => {
  utility(...e);
}, {
  theme: {
    extend: {
      animation: {
        'rotate': 'rotate-keyframes 1.55s linear infinite',
      },
      keyframes: {
        'rotate-keyframes': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(-360deg)',
          },
        },
      },
    }
  }
});
