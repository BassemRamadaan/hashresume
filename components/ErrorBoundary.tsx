import React, { ErrorInfo, ReactNode } from 'react';
import { GlassCard } from './GlassCard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
          <GlassCard className="max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6 text-sm">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-left mb-6 overflow-hidden">
                <code className="text-xs text-red-300 font-mono break-all">
                    {this.state.error?.message || "Unknown Error"}
                </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 rounded-full font-bold hover:bg-purple-500 transition"
            >
              Refresh Page
            </button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}