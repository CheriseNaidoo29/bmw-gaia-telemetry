/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GAIA Console Mount/Runtime Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHardReset = () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {
      // ignore storage errors
    }
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'Unknown runtime exception';
      const stack = this.state.error?.stack || this.state.errorInfo?.componentStack || 'No stack trace available';

      return (
        <div className="min-h-screen w-full bg-[#131315] text-[#e5e1e4] flex items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-[#1E1E24] border border-[#ef4444]/60 rounded shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ef4444]"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#ef4444] animate-ping shrink-0"></span>
              <div>
                <h1 className="text-[18px] font-bold text-[#ffb3ad] font-sans uppercase tracking-wider">
                  Critical Subsystem Fault // Mount Failure
                </h1>
                <p className="text-[12px] text-[#8b919c] font-mono mt-0.5">
                  BMW GAIA Telemetry OS encountered a fatal runtime exception.
                </p>
              </div>
            </div>

            <div className="bg-[#0e0e10] border border-[#201f21] rounded p-4 mb-4 font-mono text-[12px] text-[#ffdad7] space-y-2">
              <div className="text-[#ef4444] font-bold">
                [EXCEPTION]: {errorMsg}
              </div>
              <div className="max-h-48 overflow-y-auto text-[11px] text-[#8b919c] whitespace-pre-wrap leading-relaxed border-t border-[#201f21] pt-2">
                {stack}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#2a2a2c]">
              <span className="text-[11px] text-[#8b919c] font-mono">
                Subsystem: CORE_RENDER_PIPELINE
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={this.handleHardReset}
                  className="px-3 py-1.5 rounded bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] font-mono text-[11px] transition-colors"
                >
                  Clear Storage &amp; Reset
                </button>
                <button
                  onClick={this.handleReload}
                  className="px-4 py-1.5 rounded bg-[#0066b1] hover:bg-[#00a1fe] text-white font-mono text-[11px] font-bold transition-colors"
                >
                  Reboot Console
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
