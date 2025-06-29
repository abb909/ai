// Enhanced GPT API integration with multilingual support
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type AIProvider = 'openrouter' | 'gemini';

export interface TradingAnalysisRequest {
  symbol: string;
  marketData: any;
  schoolPrompt: string;
  provider?: AIProvider;
  language?: string; // Add language parameter
}

export interface TradingAnalysisResponse {
  analysis: string;
  confidence?: number;
  signalType?: 'buy' | 'sell' | 'hold';
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

// Language-specific trading prompts
const getLanguageInstructions = (language: string): string => {
  const instructions = {
    en: "Please respond in English with professional trading terminology.",
    ar: "يرجى الرد باللغة العربية باستخدام المصطلحات المهنية للتداول. استخدم المصطلحات المالية الصحيحة والواضحة.",
    fr: "Veuillez répondre en français en utilisant une terminologie de trading professionnelle.",
    es: "Por favor responde en español usando terminología profesional de trading.",
    de: "Bitte antworten Sie auf Deutsch mit professioneller Trading-Terminologie.",
    it: "Si prega di rispondere in italiano utilizzando terminologia professionale di trading.",
    hi: "कृपया व्यावसायिक ट्रेडिंग शब्दावली का उपयोग करते हुए हिंदी में उत्तर दें।"
  };
  
  return instructions[language as keyof typeof instructions] || instructions.en;
};

// Language-specific signal summary format
const getSignalSummaryFormat = (language: string): string => {
  const formats = {
    en: `SIGNAL SUMMARY:
Pair: [SYMBOL]
Type: [BUY/SELL/HOLD]
Entry: [price or "Wait for confirmation"]
Stop Loss: [price]
Take Profit 1: [price]
Take Profit 2: [price]
Probability: [percentage]%`,

    ar: `ملخص الإشارة:
الزوج: [SYMBOL]
النوع: [شراء/بيع/انتظار]
الدخول: [السعر أو "انتظار التأكيد"]
وقف الخسارة: [السعر]
جني الأرباح 1: [السعر]
جني الأرباح 2: [السعر]
الاحتمالية: [النسبة المئوية]%`,

    fr: `RÉSUMÉ DU SIGNAL:
Paire: [SYMBOL]
Type: [ACHAT/VENTE/ATTENDRE]
Entrée: [prix ou "Attendre confirmation"]
Stop Loss: [prix]
Take Profit 1: [prix]
Take Profit 2: [prix]
Probabilité: [pourcentage]%`,

    es: `RESUMEN DE SEÑAL:
Par: [SYMBOL]
Tipo: [COMPRA/VENTA/ESPERAR]
Entrada: [precio o "Esperar confirmación"]
Stop Loss: [precio]
Take Profit 1: [precio]
Take Profit 2: [precio]
Probabilidad: [porcentaje]%`,

    de: `SIGNAL ZUSAMMENFASSUNG:
Paar: [SYMBOL]
Typ: [KAUF/VERKAUF/WARTEN]
Einstieg: [Preis oder "Auf Bestätigung warten"]
Stop Loss: [Preis]
Take Profit 1: [Preis]
Take Profit 2: [Preis]
Wahrscheinlichkeit: [Prozent]%`,

    it: `RIASSUNTO SEGNALE:
Coppia: [SYMBOL]
Tipo: [ACQUISTO/VENDITA/ATTESA]
Entrata: [prezzo o "Attendere conferma"]
Stop Loss: [prezzo]
Take Profit 1: [prezzo]
Take Profit 2: [prezzo]
Probabilità: [percentuale]%`,

    hi: `सिग्नल सारांश:
जोड़ी: [SYMBOL]
प्रकार: [खरीदना/बेचना/प्रतीक्षा]
प्रवेश: [मूल्य या "पुष्टि की प्रतीक्षा"]
स्टॉप लॉस: [मूल्य]
टेक प्रॉफिट 1: [मूल्य]
टेक प्रॉफिट 2: [मूल्य]
संभावना: [प्रतिशत]%`
  };
  
  return formats[language as keyof typeof formats] || formats.en;
};

// Professional trading prompt template with multilingual support
const createTradingPrompt = (schoolPrompt: string, symbol: string, marketData: any, language: string = 'en'): string => {
  const jsonData = JSON.stringify(marketData, null, 2);
  const languageInstruction = getLanguageInstructions(language);
  const signalFormat = getSignalSummaryFormat(language);
  
  return `${languageInstruction}

You are an elite-level financial market analyst and trading assistant, specialized in short-term technical analysis of assets like Gold (XAU/USD), indices, and currencies.

Your task is to generate highly detailed, actionable trade recommendations based on raw candlestick data (OHLC), focusing on the 5-minute and 15-minute timeframes, while considering the context of the 1-hour and 4-hour charts.

The recommendations are for intraday scalping or short-term swings, valid for a few hours unless market structure shifts significantly.

You are allowed to use only ONE indicator: *ATR (Average True Range)* (14-period, on 15m or 5m), strictly for:
- Dynamic stop-loss placement (e.g., 1.5x ATR below demand zone)
- Assessing market volatility (avoid trades in low or extremely high volatility)
- Adjusting risk-to-reward calculations

━━━━━━━━━━━━━━━━━━━━━━
📌 *Strict Trading Rules:*
✅ Only trade setups based on *strong Supply & Demand zones*  
✅ Do *NOT* enter immediately — wait for *clear confirmation* like:
- Bullish/Bearish Engulfing candle
- CHoCH (Change of Character) on 5m
- Internal liquidity sweep or FVG mitigation

🚫 Ignore weak zones or already-mitigated zones.

━━━━━━━━━━━━━━━━━━━━━━
🔶 Definition of a "Strong Zone":
- Fresh and untouched (unmitigated)
- Originated from an aggressive move away (impulsive)
- Clearly visible on 1H or 4H charts
- Contains FVG or internal/external liquidity sweep
- Aligned with higher timeframe market structure

━━━━━━━━━━━━━━━━━━━━━━
📊 1. Multi-Timeframe Context (4H & 1H)
- What is the overall market structure and trend?
- Are we approaching any strong institutional Supply/Demand zones?
- Is there unmitigated imbalance or liquidity above/below?
- What is the current ATR value and what does it imply?

━━━━━━━━━━━━━━━━━━━━━━
📈 2. Execution Timeframes (15M & 5M)
- Detect CHoCH / BOS / liquidity traps
- Look for price action confirmations: Engulfing candle, FVG tap, etc.
- Check if ATR conditions support a clean entry
- Validate that the zone has not been touched

━━━━━━━━━━━━━━━━━━━━━━
🎯 3. Trade Setup Recommendation
- Direction: Buy / Sell / No Trade
- Entry Price: After confirmation only
- Stop Loss: Below/above structure or zone using 1.5x ATR
- TP1 & TP2: Defined profit targets
- Risk-to-Reward Ratio: To TP1 and TP2
- Trade Type: Momentum / Reversal / Liquidity Sweep
- ATR Notes: Include value and how it influenced SL or trade filtering

━━━━━━━━━━━━━━━━━━━━━━
🧠 4. Justification & Reasoning
- Why this zone specifically?
- What confirmation was used?
- How does this align with higher timeframe context?
- How did ATR and structure support this setup?

━━━━━━━━━━━━━━━━━━━━━━
⚠ 5. Invalidation / No-Trade Criteria
- Zone has already been touched or broken
- ATR is too high or too low (causing poor RR)
- No valid confirmation appears near the zone
- Sudden market structure shift or BOS in the opposite direction

IMPORTANT: At the end of your analysis, provide a structured summary in this exact format:

${signalFormat}

📝 Format your analysis like a professional trader's briefing note — clean, structured, and concise — as if you're advising a prop trading firm.
Be as brief as possible in your answer and give me only the important points such as the recommendation, the reason for entering and its success rate.

TRADING SCHOOL METHODOLOGY:
${schoolPrompt}

SYMBOL: ${symbol}

Here is the multi-timeframe candlestick data:

${jsonData}`;
};

// Function to extract structured signal data from AI response (multilingual)
export const extractSignalData = (response: string, symbol: string, language: string = 'en'): any => {
  try {
    // Language-specific patterns for signal summary extraction
    const summaryPatterns = {
      en: /SIGNAL SUMMARY:([\s\S]*?)(?:\n\n|$)/i,
      ar: /ملخص الإشارة:([\s\S]*?)(?:\n\n|$)/i,
      fr: /RÉSUMÉ DU SIGNAL:([\s\S]*?)(?:\n\n|$)/i,
      es: /RESUMEN DE SEÑAL:([\s\S]*?)(?:\n\n|$)/i,
      de: /SIGNAL ZUSAMMENFASSUNG:([\s\S]*?)(?:\n\n|$)/i,
      it: /RIASSUNTO SEGNALE:([\s\S]*?)(?:\n\n|$)/i,
      hi: /सिग्नल सारांश:([\s\S]*?)(?:\n\n|$)/i
    };

    // Field name patterns for different languages
    const fieldPatterns = {
      en: {
        pair: /(?:Pair|Symbol):\s*([^\n]+)/i,
        type: /Type:\s*([^\n]+)/i,
        entry: /Entry:\s*([^\n]+)/i,
        stopLoss: /Stop Loss:\s*([^\n]+)/i,
        takeProfit1: /Take Profit 1:\s*([^\n]+)/i,
        takeProfit2: /Take Profit 2:\s*([^\n]+)/i,
        probability: /Probability:\s*([^\n]+)/i
      },
      ar: {
        pair: /(?:الزوج|الرمز):\s*([^\n]+)/i,
        type: /النوع:\s*([^\n]+)/i,
        entry: /الدخول:\s*([^\n]+)/i,
        stopLoss: /وقف الخسارة:\s*([^\n]+)/i,
        takeProfit1: /جني الأرباح 1:\s*([^\n]+)/i,
        takeProfit2: /جني الأرباح 2:\s*([^\n]+)/i,
        probability: /الاحتمالية:\s*([^\n]+)/i
      },
      fr: {
        pair: /(?:Paire|Symbole):\s*([^\n]+)/i,
        type: /Type:\s*([^\n]+)/i,
        entry: /Entrée:\s*([^\n]+)/i,
        stopLoss: /Stop Loss:\s*([^\n]+)/i,
        takeProfit1: /Take Profit 1:\s*([^\n]+)/i,
        takeProfit2: /Take Profit 2:\s*([^\n]+)/i,
        probability: /Probabilité:\s*([^\n]+)/i
      },
      es: {
        pair: /(?:Par|Símbolo):\s*([^\n]+)/i,
        type: /Tipo:\s*([^\n]+)/i,
        entry: /Entrada:\s*([^\n]+)/i,
        stopLoss: /Stop Loss:\s*([^\n]+)/i,
        takeProfit1: /Take Profit 1:\s*([^\n]+)/i,
        takeProfit2: /Take Profit 2:\s*([^\n]+)/i,
        probability: /Probabilidad:\s*([^\n]+)/i
      },
      de: {
        pair: /(?:Paar|Symbol):\s*([^\n]+)/i,
        type: /Typ:\s*([^\n]+)/i,
        entry: /Einstieg:\s*([^\n]+)/i,
        stopLoss: /Stop Loss:\s*([^\n]+)/i,
        takeProfit1: /Take Profit 1:\s*([^\n]+)/i,
        takeProfit2: /Take Profit 2:\s*([^\n]+)/i,
        probability: /Wahrscheinlichkeit:\s*([^\n]+)/i
      },
      it: {
        pair: /(?:Coppia|Simbolo):\s*([^\n]+)/i,
        type: /Tipo:\s*([^\n]+)/i,
        entry: /Entrata:\s*([^\n]+)/i,
        stopLoss: /Stop Loss:\s*([^\n]+)/i,
        takeProfit1: /Take Profit 1:\s*([^\n]+)/i,
        takeProfit2: /Take Profit 2:\s*([^\n]+)/i,
        probability: /Probabilità:\s*([^\n]+)/i
      },
      hi: {
        pair: /(?:जोड़ी|प्रतीक):\s*([^\n]+)/i,
        type: /प्रकार:\s*([^\n]+)/i,
        entry: /प्रवेश:\s*([^\n]+)/i,
        stopLoss: /स्टॉप लॉस:\s*([^\n]+)/i,
        takeProfit1: /टेक प्रॉफिट 1:\s*([^\n]+)/i,
        takeProfit2: /टेक प्रॉफिट 2:\s*([^\n]+)/i,
        probability: /संभावना:\s*([^\n]+)/i
      }
    };

    // Get patterns for current language, fallback to English
    const summaryPattern = summaryPatterns[language as keyof typeof summaryPatterns] || summaryPatterns.en;
    const fields = fieldPatterns[language as keyof typeof fieldPatterns] || fieldPatterns.en;

    // Look for the signal summary section
    const summaryMatch = response.match(summaryPattern);
    if (!summaryMatch) {
      // Fallback: try to extract basic signal type from any language
      const lowerResponse = response.toLowerCase();
      let type: 'buy' | 'sell' | 'hold' = 'hold';
      
      // Multi-language signal type detection
      if (lowerResponse.includes('buy') || lowerResponse.includes('long') || 
          lowerResponse.includes('شراء') || lowerResponse.includes('achat') || 
          lowerResponse.includes('compra') || lowerResponse.includes('kauf') || 
          lowerResponse.includes('acquisto') || lowerResponse.includes('खरीदना')) {
        type = 'buy';
      } else if (lowerResponse.includes('sell') || lowerResponse.includes('short') || 
                 lowerResponse.includes('بيع') || lowerResponse.includes('vente') || 
                 lowerResponse.includes('venta') || lowerResponse.includes('verkauf') || 
                 lowerResponse.includes('vendita') || lowerResponse.includes('बेचना')) {
        type = 'sell';
      }
      
      return {
        pair: symbol,
        type,
        entry: null,
        stopLoss: null,
        takeProfit1: null,
        takeProfit2: null,
        probability: null
      };
    }
    
    const summaryText = summaryMatch[1];
    
    // Extract each field using language-specific patterns
    const extractField = (pattern: RegExp): string | null => {
      const match = summaryText.match(pattern);
      return match ? match[1].trim() : null;
    };
    
    const extractPrice = (value: string | null): number | null => {
      if (!value) return null;
      const numMatch = value.match(/[\d,]+\.?\d*/);
      return numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : null;
    };
    
    const extractPercentage = (value: string | null): number | null => {
      if (!value) return null;
      const numMatch = value.match(/(\d+(?:\.\d+)?)/);
      return numMatch ? parseFloat(numMatch[1]) : null;
    };
    
    // Normalize signal type across languages
    const normalizeSignalType = (typeStr: string | null): 'buy' | 'sell' | 'hold' => {
      if (!typeStr) return 'hold';
      const lower = typeStr.toLowerCase();
      
      if (lower.includes('buy') || lower.includes('long') || lower.includes('شراء') || 
          lower.includes('achat') || lower.includes('compra') || lower.includes('kauf') || 
          lower.includes('acquisto') || lower.includes('खरीदना')) {
        return 'buy';
      } else if (lower.includes('sell') || lower.includes('short') || lower.includes('بيع') || 
                 lower.includes('vente') || lower.includes('venta') || lower.includes('verkauf') || 
                 lower.includes('vendita') || lower.includes('बेचना')) {
        return 'sell';
      }
      return 'hold';
    };
    
    const pair = extractField(fields.pair) || symbol;
    const type = normalizeSignalType(extractField(fields.type));
    const entry = extractPrice(extractField(fields.entry));
    const stopLoss = extractPrice(extractField(fields.stopLoss));
    const takeProfit1 = extractPrice(extractField(fields.takeProfit1));
    const takeProfit2 = extractPrice(extractField(fields.takeProfit2));
    const probability = extractPercentage(extractField(fields.probability));
    
    return {
      pair,
      type,
      entry,
      stopLoss,
      takeProfit1,
      takeProfit2,
      probability
    };
  } catch (error) {
    console.error('Error extracting signal data:', error);
    return {
      pair: symbol,
      type: 'hold',
      entry: null,
      stopLoss: null,
      takeProfit1: null,
      takeProfit2: null,
      probability: null
    };
  }
};

export const generateTradingSignalWithRealData = async ({
  symbol,
  marketData,
  schoolPrompt,
  provider = 'openrouter',
  language = 'en'
}: TradingAnalysisRequest): Promise<{ analysis: string; signal: any }> => {
  try {
    const prompt = createTradingPrompt(schoolPrompt, symbol, marketData, language);
    
    let analysis: string;
    if (provider === 'gemini') {
      analysis = await callGeminiAPI(prompt);
    } else {
      analysis = await callOpenRouterAPI(prompt);
    }
    
    // Extract structured signal data with language support
    const signal = extractSignalData(analysis, symbol, language);
    
    return { analysis, signal };
  } catch (error) {
    console.error('Error generating trading signal:', error);
    throw new Error(`Failed to generate trading signal: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const callOpenRouterAPI = async (prompt: string): Promise<string> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }
  
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Trading Signals'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert trading analyst. Provide clear, actionable trading recommendations based on the candlestick data provided. Include confidence level, signal type (buy/sell/hold), and reasoning. Always respond in the language requested by the user.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No recommendation generated';
};

const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0, 
        topK: 1, 
        maxOutputTokens: 4096 
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No recommendation generated';
};

// Legacy function for backward compatibility
export const generateTradingSignal = async (prompt: string, candlestickData: any) => {
  const result = await generateTradingSignalWithRealData({
    symbol: 'UNKNOWN',
    marketData: candlestickData,
    schoolPrompt: prompt,
    provider: 'openrouter'
  });
  return result.analysis;
};

// Generate mock candlestick data (keeping for fallback)
export const generateMockCandlestickData = () => {
  const data = [];
  const basePrice = 100;
  let currentPrice = basePrice;
  
  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.5) * 4;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    data.push({
      timestamp: new Date(Date.now() - (19 - i) * 60 * 60 * 1000).toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 1000
    });
    
    currentPrice = close;
  }
  
  return data;
};