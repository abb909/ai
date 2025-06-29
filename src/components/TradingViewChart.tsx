import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  theme?: 'light' | 'dark';
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
  theme = 'dark' 
}) => {
  const { language } = useLanguage();
  const [iframeKey, setIframeKey] = useState(0);
  
  // Get the correct TradingView symbol
  const getTradingViewSymbol = (symbol: string): string => {
    return TRADINGVIEW_SYMBOL_MAPPING[symbol.toUpperCase()] || `OANDA:${symbol.toUpperCase()}`;
  };

  // Get supported TradingView locale
  const getTradingViewLocale = (language: string): string => {
    return TRADINGVIEW_LOCALE_MAPPING[language] || 'en';
  };

  // Force iframe refresh when symbol changes
  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [symbol, language, theme]);

  const tradingViewSymbol = getTradingViewSymbol(symbol);
  const tradingViewLocale = getTradingViewLocale(language);
  
  // Create TradingView widget configuration
  const widgetConfig = {
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
    hide_top_toolbar: false,
    hide_legend: false,
    save_image: false,
    hide_volume: false,
    studies: ["Volume@tv-basicstudies"],
    show_popup_button: false,
    popup_width: "1000",
    popup_height: "650"
  };

  // Create the iframe URL with all parameters
  const createIframeUrl = () => {
    const baseUrl = 'https://www.tradingview.com/widgetembed/';
    const params = new URLSearchParams({
      frameElementId: 'tradingview_chart',
      symbol: widgetConfig.symbol,
      interval: widgetConfig.interval,
      hidesidetoolbar: '1',
      symboledit: '1',
      saveimage: '0',
      toolbarbg: widgetConfig.toolbar_bg,
      studies: 'Volume@tv-basicstudies',
      theme: widgetConfig.theme,
      style: widgetConfig.style,
      timezone: widgetConfig.timezone,
      locale: widgetConfig.locale,
      withdateranges: '1',
      hide_side_toolbar: '0',
      allow_symbol_change: '1',
      details: '1',
      hotlist: '1',
      calendar: '1',
      show_popup_button: '0',
      studies_overrides: '{}',
      overrides: '{}',
      enabled_features: '[]',
      disabled_features: '[]'
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const iframeUrl = createIframeUrl();

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Advanced Chart - {symbol}</span>
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Live Data</span>
          </div>
          <span>•</span>
          <span>TradingView</span>
        </div>
      </div>

      <div 
        className="w-full rounded-lg overflow-hidden bg-gray-900 relative"
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        <iframe
          key={iframeKey}
          src={iframeUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowTransparency={true}
          scrolling="no"
          allowFullScreen={true}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            margin: '0px',
            padding: '0px',
            border: 'none'
          }}
          title={`TradingView Chart - ${tradingViewSymbol}`}
          onLoad={() => {
            console.log('TradingView chart loaded successfully for', tradingViewSymbol);
          }}
          onError={(e) => {
            console.error('TradingView iframe failed to load:', e);
          }}
        />
        
        {/* Loading overlay - will be hidden once iframe loads */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 pointer-events-none opacity-0 transition-opacity duration-300">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading TradingView Chart...</p>
            <p className="text-gray-500 text-sm mt-2">{tradingViewSymbol}</p>
          </div>
        </div>
      </div>

      {/* Chart Info */}
      <div className="mt-4 p-3 bg-black/20 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Symbol: {tradingViewSymbol}</span>
            <span>Timeframe: Multiple</span>
            <span>Provider: TradingView</span>
            <span>Language: {tradingViewLocale.toUpperCase()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400">● Live</span>
            <span>Real-time data</span>
          </div>
        </div>
      </div>

      {/* Chart Controls Info */}
      <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-xs">
          💡 <strong>Chart Controls:</strong> Use the toolbar within the chart to change timeframes (5m, 15m, 1h, 4h), add indicators, and customize the view. The chart automatically updates when you select a different trading pair.
        </p>
      </div>
    </div>
  );
};

export default TradingViewChart;