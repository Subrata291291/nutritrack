import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils/test-utils';
import { Modal } from '../src/components/shared/Modal';
import { ErrorBoundary } from '../src/components/shared/ErrorBoundary';

vi.mock('../src/services/notifications.service', () => ({
  notificationsService: {
    getNotifications: vi.fn().mockResolvedValue({ notifications: [], unread: 0 }),
    markAllRead: vi.fn(),
  },
}));

describe('Modal accessibility', () => {
  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has close button when title is provided', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
  });

  it('renders title as heading', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Accessible Modal">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Accessible Modal')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    const { container } = renderWithProviders(
      <Modal open={false} onClose={vi.fn()}>
        <p>Hidden content</p>
      </Modal>
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders modal content when open', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('ErrorBoundary fallback', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders error message text', () => {
    const Child = () => { throw new Error('Something broke'); };
    renderWithProviders(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('error message is displayed', () => {
    const Child = () => { throw new Error('Alert test'); };
    renderWithProviders(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
    expect(screen.getByText('Alert test')).toBeInTheDocument();
  });

  it('retry button is rendered', () => {
    const Child = () => { throw new Error('Focus test'); };
    renderWithProviders(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
    const retryBtn = screen.getByRole('button', { name: /reload page/i });
    expect(retryBtn).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error UI</div>;
    const Child = () => { throw new Error('Custom test'); };
    renderWithProviders(
      <ErrorBoundary fallback={<CustomFallback />}>
        <Child />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });

  it('renders children when no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <p>Normal content</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });
});
