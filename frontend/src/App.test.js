import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';

jest.mock('./services/api', () => ({
  checkBackendHealth: jest.fn().mockResolvedValue(false),
  predictCropDisease: jest.fn(),
}));

test('renders the LeafLens home page', () => {
  localStorage.removeItem('leaflens_token');
  const container = document.createElement('div');
  act(() => {
    ReactDOM.render(<App />, container);
  });
  expect(container.textContent).toContain('Snap a leaf. Protect your harvest in seconds.');
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});
