import { Component } from 'react';
import GoldButton from '@/components/buttons/GoldButton';
import Logo from '@/components/ui/Logo';

// React only supports error boundaries as class components (no hook
// equivalent exists) — this catches render errors anywhere below it so a
// thrown error shows a recoverable screen instead of a blank white page.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught a render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
        <Logo className="h-11 w-auto" />
        <h1 className="font-heading text-2xl text-brown">Something went wrong.</h1>
        <p className="max-w-sm text-sm text-text/60">
          We hit an unexpected error loading this page. Reloading usually fixes it.
        </p>
        <GoldButton onClick={() => window.location.reload()}>Reload</GoldButton>
      </div>
    );
  }
}
