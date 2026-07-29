import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '@contexts/AuthProvider';
import { ThemeProvider } from '@contexts/ThemeContext';
import { OnboardingProvider } from '@contexts/OnboardingProvider';

interface WrapperOptions {
  initialEntries?: string[];
  withAuth?: boolean;
  withTheme?: boolean;
  withOnboarding?: boolean;
}

function createWrapper(options: WrapperOptions = {}) {
  const { initialEntries = ['/'], withAuth = true, withTheme = true, withOnboarding = false } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    let content = children;
    if (withOnboarding) content = <OnboardingProvider>{content}</OnboardingProvider>;
    if (withTheme) content = <ThemeProvider>{content}</ThemeProvider>;
    if (withAuth) content = <AuthProvider>{content}</AuthProvider>;
    return <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>;
  }

  return Wrapper;
}

function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & WrapperOptions,
) {
  const { initialEntries, withAuth, withTheme, withOnboarding, ...renderOptions } = options ?? {};

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: createWrapper({ initialEntries, withAuth, withTheme, withOnboarding }), ...renderOptions }),
  };
}

export { renderWithProviders, createWrapper };
