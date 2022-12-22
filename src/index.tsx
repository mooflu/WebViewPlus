import React from 'react';
import { createRoot } from 'react-dom/client';

import '@utils/i18n';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
