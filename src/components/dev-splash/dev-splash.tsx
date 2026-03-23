import React from 'react';
import './dev-splash.scss';

const DevSplash = () => {
    return (
        <div className="dev-splash">
            <div className="dev-splash__container">
                <div className="dev-splash__logo">
                    <div className="dev-splash__logo-icon">🤖</div>
                    <h1 className="dev-splash__title">Deriv Bot</h1>
                </div>
                
                <div className="dev-splash__content">
                    <p className="dev-splash__subtitle">Build a trading bot without coding</p>
                    
                    <div className="dev-splash__features">
                        <div className="dev-splash__feature">
                            <span className="dev-splash__feature-icon">📊</span>
                            <span className="dev-splash__feature-text">Visual Block Editor</span>
                        </div>
                        <div className="dev-splash__feature">
                            <span className="dev-splash__feature-icon">⚡</span>
                            <span className="dev-splash__feature-text">Lightning Fast</span>
                        </div>
                        <div className="dev-splash__feature">
                            <span className="dev-splash__feature-icon">🔐</span>
                            <span className="dev-splash__feature-text">Secure Trading</span>
                        </div>
                    </div>
                </div>

                <div className="dev-splash__footer">
                    <p className="dev-splash__loading">Initializing application...</p>
                    <div className="dev-splash__spinner"></div>
                </div>
            </div>
        </div>
    );
};

export default DevSplash;
