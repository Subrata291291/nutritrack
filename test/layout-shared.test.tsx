import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import { renderWithProviders } from './utils/test-utils';
import { Modal } from '@components/shared/Modal';
import { ProgressRing } from '@components/ui/ProgressRing';
import { Toggle } from '@components/ui/Toggle';
import { ErrorBoundary } from '@components/shared/ErrorBoundary';
import { MobileDrawer } from '@components/layout/MobileDrawer';

describe('Modal', () => {
  it('renders children when open', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <Modal open={false} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop clicked', async () => {
    const onClose = vi.fn();
    renderWithProviders(
      <Modal open={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    );
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/40');
    expect(backdrop).toBeInTheDocument();
    if (backdrop) {
      (backdrop as HTMLElement).click();
    }
    expect(onClose).toHaveBeenCalled();
  });

  it('renders title when provided', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Title">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    renderWithProviders(
      <Modal open={true} onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>
    );
    const closeBtn = screen.getByText('close');
    closeBtn.click();
    expect(onClose).toHaveBeenCalled();
  });
});

describe('ProgressRing', () => {
  it('renders SVG element', () => {
    const { container } = renderWithProviders(<ProgressRing progress={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with correct progress percentage', () => {
    const { container } = renderWithProviders(<ProgressRing progress={75} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
    const progressCircle = circles[1];
    expect(progressCircle).toHaveAttribute('stroke-dashoffset');
  });

  it('renders label when provided', () => {
    renderWithProviders(<ProgressRing progress={50} label="75%" />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('clamps progress to 100', () => {
    const { container } = renderWithProviders(<ProgressRing progress={150} />);
    const circles = container.querySelectorAll('circle');
    const offset = circles[1].getAttribute('stroke-dashoffset');
    expect(offset).toBe('0');
  });

  it('renders with custom size', () => {
    const { container } = renderWithProviders(<ProgressRing progress={50} size={100} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '100');
  });
});

describe('Toggle', () => {
  it('renders unchecked by default', () => {
    renderWithProviders(<Toggle checked={false} onChange={vi.fn()} />);
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'false');
  });

  it('renders checked state', () => {
    renderWithProviders(<Toggle checked={true} onChange={vi.fn()} />);
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange with true when unchecked and clicked', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<Toggle checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked and clicked', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<Toggle checked={true} onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<Toggle checked={false} onChange={onChange} disabled={true} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders label text when provided', () => {
    renderWithProviders(<Toggle checked={false} onChange={vi.fn()} label="Dark Mode" />);
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('has disabled attribute when disabled', () => {
    renderWithProviders(<Toggle checked={false} onChange={vi.fn()} disabled={true} />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('catches errors and shows default fallback', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    renderWithProviders(
      <ErrorBoundary fallback={<p>Custom error UI</p>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });

  it('does not show fallback when no error occurs', () => {
    renderWithProviders(
      <ErrorBoundary fallback={<p>Custom error UI</p>}>
        <p>Normal content</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
    expect(screen.queryByText('Custom error UI')).not.toBeInTheDocument();
  });
});

describe('MobileDrawer', () => {
  it('renders children when open', () => {
    renderWithProviders(
      <MobileDrawer open={true} onClose={vi.fn()}>
        <p>Drawer content</p>
      </MobileDrawer>
    );
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('does not render children visibly when closed (translate-x-full)', () => {
    const { container } = renderWithProviders(
      <MobileDrawer open={false} onClose={vi.fn()}>
        <p>Drawer content</p>
      </MobileDrawer>
    );
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer).toHaveClass('-translate-x-full');
  });

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <MobileDrawer open={true} onClose={onClose}>
        <p>Content</p>
      </MobileDrawer>
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
    if (backdrop) {
      (backdrop as HTMLElement).click();
    }
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <MobileDrawer open={true} onClose={onClose}>
        <p>Content</p>
      </MobileDrawer>
    );
    const closeBtn = screen.getByText('close');
    closeBtn.click();
    expect(onClose).toHaveBeenCalled();
  });

  it('displays NutriTrack header when open', () => {
    renderWithProviders(
      <MobileDrawer open={true} onClose={vi.fn()}>
        <p>Content</p>
      </MobileDrawer>
    );
    expect(screen.getByText('NutriTrack')).toBeInTheDocument();
  });
});
