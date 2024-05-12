/* eslint-disable no-undef */
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import * as Sentry from '@sentry/capacitor';
import * as SentryReact from '@sentry/react';

import App from './App';

Sentry.init(
  {
    dsn: import.meta.env.VITE_SENTRY_DSN as string,
    release: 'peoplehere@0.1.2',
    dist: '1',
    integrations: [
      new SentryReact.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
      }),
      new SentryReact.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  },
  // Forward the init method from @sentry/react
  SentryReact.init,
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
