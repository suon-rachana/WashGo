import { Component, type ReactNode } from 'react';

interface MapErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time failures from the real MapView (e.g. the native module
 * failing to load) and swaps in the mock canvas instead of crashing the
 * booking flow.
 */
export class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  state: MapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
