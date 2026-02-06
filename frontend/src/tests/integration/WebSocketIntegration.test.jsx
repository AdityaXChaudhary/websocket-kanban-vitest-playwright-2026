import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import KanbanBoard from '../../components/KanbanBoard';
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }) => <div style={{ width: '500px', height: '300px' }}>{children}</div>,
  };
});
 test('WebSocket receives task update', () => {
   render(<KanbanBoard tasks={[]} />);
  expect(screen.getByText(/Real-time Kanban/i)).toBeInTheDocument();
});