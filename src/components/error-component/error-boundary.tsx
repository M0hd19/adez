import React from 'react';
import ErrorComponent from './index';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    info: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children?: React.ReactNode;
    root_store?: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            info: null,
        };
    }

    componentDidCatch = (error: Error, info: React.ErrorInfo) => {
        if ((window as any).TrackJS) {
            (window as any).TrackJS.console.log(this.props.root_store);
        }

        this.setState({
            hasError: true,
            error,
            info,
        });
    };

    render = () => {
        if (this.state.hasError) {
            return <ErrorComponent should_show_refresh={true} />;
        }
        return this.props.children;
    };
}

export default ErrorBoundary;
