import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { setTradingViewWidget } from '../services/tradingViewData';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  theme?: 'light' | 'dark';
  onDataReady?: (hasData: boolean) => void;
}

// Symbol mapping for TradingView
const TRADINGVIEW_SYMBOL_MAPPING: { [key: string]: string } = {
  'XAUUSD': 'OANDA:XAUUSD',
  'EURUSD': 'OANDA:EURUSD',
  'GBPUSD': 'OANDA:GBPUSD',
  'USDJPY': 'OANDA:USDJPY',
  'USDCHF': 'OANDA:USDCHF',
  'AUDUSD': 'OANDA:AUDUSD',
  'USDCAD': 'OANDA:USDCAD',
  'NZDUSD': 'OANDA:NZDUSD',
  'US30': 'OANDA:US30USD',
  'NAS100': 'OANDA:NAS100USD',
  'SPX': 'OANDA:SPX500USD',
  'NDX': 'OANDA:NAS100USD',
  'DJI': 'OANDA:US30USD',
  'BTCUSD': 'COINBASE:BTCUSD',
  'ETHUSD': 'COINBASE:ETHUSD'
};

// TradingView supported locales mapping
const TRADINGVIEW_LOCALE_MAPPING: { [key: string]: string } = {
  'en': 'en',
  'ar': 'ar',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'hi': 'en', // Hindi not supported, fallback to English
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  height = 600, 
  theme = 'dark',
  onDataReady
}) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the correct TradingView symbol
  const getTradingViewSymbol = (symbol: string): string => {
    return TRADINGVIEW_SYMBOL_MAPPING[symbol.toUpperCase()] || `OANDA:${symbol.toUpperCase()}`;
  };

  // Get supported TradingView locale
  const getTradingViewLocale = (language: string): string => {
    return TRADINGVIEW_LOCALE_MAPPING[language] || 'en';
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const tradingViewSymbol = getTradingViewSymbol(symbol);
    const tradingViewLocale = getTradingViewLocale(language);

    // Clean up previous widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.warn('Error removing previous widget:', e);
      }
      widgetRef.current = null;
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    setIsLoading(true);
    setError(null);

    // Load TradingView script if not already loaded
    const loadTradingViewScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TradingView) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load TradingView script'));
        document.head.appendChild(script);
      });
    };

    const createWidget = () => {
      if (!containerRef.current || !window.TradingView) return;

      try {
        console.log(`🔄 Creating TradingView widget for ${tradingViewSymbol}...`);

        const widget = new window.TradingView.widget({
          autosize: true,
          symbol: tradingViewSymbol,
          interval: "5",
          timezone: "Etc/UTC",
          theme: theme === 'dark' ? 'dark' : 'light',
          style: "1", // Candlestick
          locale: tradingViewLocale,
          toolbar_bg: theme === 'dark' ? "#1a1a1a" : "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          hide_volume: false,
          studies: ["Volume@tv-basicstudies"],
          show_popup_button: false,
          popup_width: "1000",
          popup_height: "650",
          onChartReady: () => {
            console.log('✅ TradingView chart ready');
            setIsLoading(false);
            
            // Set the widget reference for data extraction
            setTradingViewWidget(widget);
            
            // Notify parent component that data is ready
            if (onDataReady) {
              onDataReady(true);
            }
          }
        });

        widgetRef.current = widget;

      } catch (error) {
        console.error('Error creating TradingView widget:', error);
        setError('Failed to load chart');
        setIsLoading(false);
        
        if (onDataReady) {
          onDataReady(false);
        }
      }
    };

    // Load script and create widget
    loadTradingViewScript()
      .then(createWidget)
      .catch((error) => {
        console.error('Error loading TradingView:', error);
        setError('Failed to load TradingView');
        setIsLoading(false);
        
        if (onDataReady) {
          onDataReady(false);
        }
      });

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.warn('Error cleaning up widget:', e);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, language, theme, onDataReady]);

  // Generate unique container ID
  const containerId = `tradingview-widget-${symbol}-${Date.now()}`;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Live Chart - {symbol}</span>
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : error ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span>{isLoading ? 'Loading...' : error ? 'Error' : 'Live Data'}</span>
          </div>
          <span>•</span>
          <span>TradingView</span>
        </div>
      </div>

      <div 
        ref={containerRef}
        id={containerId}
        className="w-full rounded-lg overflow-hidden bg-gray-900 relative"
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading TradingView Chart...</p>
              <p className="text-gray-500 text-sm mt-2">{getTradingViewSymbol(symbol)}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="text-red-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-400 font-semibold">{error}</p>
              <p className="text-gray-500 text-sm mt-2">Chart data will use fallback mode</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Info */}
      <div className="mt-4 p-3 bg-black/20 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Symbol: {getTradingViewSymbol(symbol)}</span>
            <span>Timeframe: Multiple</span>
            <span>Provider: TradingView</span>
            <span>Language: {getTradingViewLocale(language).toUpperCase()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`${isLoading ? 'text-yellow-400' : error ? 'text-red-400' : 'text-green-400'}`}>
              ● {isLoading ? 'Loading' : error ? 'Error' : 'Live'}
            </span>
            <span>Real-time data</span>
          </div>
        </div>
      </div>

      {/* Data Extraction Info */}
      <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-green-400 text-xs">
          💡 <strong>Smart Data Extraction:</strong> This chart provides live market data directly to your AI analysis without requiring external APIs. The system automatically extracts OHLC data from the chart for signal generation.
        </p>
      </div>
    </div>
  );
};

// Declare TradingView global
declare global {
  interface Window {
    TradingView: any;
  }
}

export default TradingViewChart;