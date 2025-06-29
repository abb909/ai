import React, { useEffect, useRef } from 'react';
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

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  height = 600, 
  theme = 'dark' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  // Get the correct TradingView symbol
  const getTradingViewSymbol = (symbol: string): string => {
    return TRADINGVIEW_SYMBOL_MAPPING[symbol.toUpperCase()] || `OANDA:${symbol.toUpperCase()}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    // Create TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    const tradingViewSymbol = getTradingViewSymbol(symbol);
    
    // Widget configuration
    const config = {
      autosize: true,
      symbol: tradingViewSymbol,
      interval: "5",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: language === 'ar' ? 'ar' : language,
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: false,
      container_id: "tradingview_chart",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com"
    };

    script.innerHTML = JSON.stringify(config);

    // Create container div for the widget
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const chartContainer = document.createElement('div');
    chartContainer.id = 'tradingview_chart';
    chartContainer.style.height = '100%';
    chartContainer.style.width = '100%';

    widgetContainer.appendChild(chartContainer);
    widgetContainer.appendChild(script);

    containerRef.current.appendChild(widgetContainer);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme, language]);

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
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden bg-gray-900"
        style={{ height: `${height}px`, minHeight: '400px' }}
      >
        {/* Loading placeholder */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading TradingView Chart...</p>
            <p className="text-gray-500 text-sm mt-2">{getTradingViewSymbol(symbol)}</p>
          </div>
        </div>
      </div>

      {/* Chart Info */}
      <div className="mt-4 p-3 bg-black/20 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Symbol: {getTradingViewSymbol(symbol)}</span>
            <span>Timeframe: Multiple</span>
            <span>Provider: TradingView</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400">● Live</span>
            <span>Real-time data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;