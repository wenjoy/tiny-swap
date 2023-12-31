import { render, screen, waitFor } from '@testing-library/react';
import Account from './Account';

jest.mock('../utils', () => {
  return {
    getSigner: jest.fn(() => ({ address: '0x1234' }))
  }
})

test('should show account info', async () => {
  render(<Account />)
  await waitFor(() => {
    screen.getByText(/0x12/)
  })
})