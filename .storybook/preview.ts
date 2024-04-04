import { setupIonicReact } from '@ionic/react';
import type { Preview } from '@storybook/react';
import '../src/theme/tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

setupIonicReact();

export default preview;
