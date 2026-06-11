import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050810] flex flex-col items-center justify-center p-6 text-gray-200 font-sans">
          <div className="bg-dark-800/80 backdrop-blur-xl border border-red-500/30 rounded-3xl p-10 max-w-2xl w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-8 text-lg">
              We encountered an unexpected error while rendering this page. Our team has been notified.
            </p>
            
            {this.state.error && (
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 mb-8 text-left overflow-x-auto">
                <p className="text-red-400 font-mono text-sm font-bold mb-2">{this.state.error.toString()}</p>
                <p className="text-gray-500 font-mono text-xs whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-dark-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={18} /> Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-bold rounded-xl border border-dark-600 transition-colors"
              >
                <Home size={18} /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
