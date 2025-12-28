import React from 'react';
import { createRoot } from 'react-dom/client';
import EvilApp from './components/EvilApp';

const root = createRoot(document.getElementById('app'));
root.render(<EvilApp />);
