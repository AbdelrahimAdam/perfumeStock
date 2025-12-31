import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { getExchangeRates, getCurrencyRates, convertCurrency } from '@/services/currencyService'
import type { Currency, ExchangeRate, CurrencyConversion, CurrencyStoreState } from '@/types/currency'

export const useCurrencyStore = defineStore('currency', () => {
  // State
  const state = reactive<CurrencyStoreState>({
    currentCurrency: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: '🇺🇸',
      rate: 1
    },
    exchangeRates: [] as ExchangeRate[],
    popularCurrencies: [] as Currency[],
    isLoading: false,
    error: null,
    lastUpdated: null,
    conversionHistory: [] as CurrencyConversion[]
  })

  // Available currencies with luxury focus (Middle Eastern + Major)
  const availableCurrencies = ref<Currency[]>([
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: '🇺🇸',
      rate: 1
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      flag: '🇪🇺',
      rate: 0.92
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: '🇬🇧',
      rate: 0.79
    },
    {
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      flag: '🇦🇪',
      rate: 3.67,
      isLuxury: true
    },
    {
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'ر.س',
      flag: '🇸🇦',
      rate: 3.75,
      isLuxury: true
    },
    {
      code: 'QAR',
      name: 'Qatari Riyal',
      symbol: 'ر.ق',
      flag: '🇶🇦',
      rate: 3.64,
      isLuxury: true
    },
    {
      code: 'KWD',
      name: 'Kuwaiti Dinar',
      symbol: 'د.ك',
      flag: '🇰🇼',
      rate: 0.31,
      isLuxury: true
    },
    {
      code: 'EGP',
      name: 'Egyptian Pound',
      symbol: '£',
      flag: '🇪🇬',
      rate: 30.9
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      flag: '🇯🇵',
      rate: 148.5
    },
    {
      code: 'CNY',
      name: 'Chinese Yuan',
      symbol: '¥',
      flag: '🇨🇳',
      rate: 7.18
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF',
      flag: '🇨🇭',
      rate: 0.88
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'CA$',
      flag: '🇨🇦',
      rate: 1.36
    }
  ])

  // Getters
  const currentCurrency = computed(() => state.currentCurrency)
  const exchangeRates = computed(() => state.exchangeRates)
  const popularCurrencies = computed(() => state.popularCurrencies)
  const isLoading = computed(() => state.isLoading)
  const error = computed(() => state.error)
  const lastUpdated = computed(() => state.lastUpdated)
  const conversionHistory = computed(() => state.conversionHistory)

  const luxuryCurrencies = computed(() => 
    availableCurrencies.value.filter(currency => currency.isLuxury)
  )

  const formattedCurrencies = computed(() => 
    availableCurrencies.value.map(currency => ({
      ...currency,
      formattedRate: formatExchangeRate(currency.rate)
    }))
  )

  const currencyOptions = computed(() => 
    availableCurrencies.value.map(currency => ({
      value: currency.code,
      label: `${currency.flag} ${currency.code} - ${currency.name}`,
      symbol: currency.symbol
    }))
  )

  const getCurrencyByCode = computed(() => 
    (code: string) => availableCurrencies.value.find(c => c.code === code)
  )

  const getExchangeRate = computed(() => 
    (from: string, to: string) => {
      const fromCurrency = availableCurrencies.value.find(c => c.code === from)
      const toCurrency = availableCurrencies.value.find(c => c.code === to)
      
      if (!fromCurrency || !toCurrency) return 1
      
      return toCurrency.rate / fromCurrency.rate
    }
  )

  // Actions
  const initializeCurrency = async () => {
    try {
      // Load saved preference
      const savedCurrency = localStorage.getItem('luxury_currency')
      
      if (savedCurrency) {
        const currency = availableCurrencies.value.find(c => c.code === savedCurrency)
        if (currency) {
          state.currentCurrency = currency
        }
      }

      // Load exchange rates
      await fetchExchangeRates()
      
      // Set popular currencies (luxury + current)
      setPopularCurrencies()
      
    } catch (err) {
      console.error('Failed to initialize currency:', err)
      state.error = 'Failed to initialize currency settings'
    }
  }

  const setCurrency = async (currencyCode: string) => {
    const currency = availableCurrencies.value.find(c => c.code === currencyCode)
    
    if (!currency) {
      throw new Error(`Currency ${currencyCode} not found`)
    }

    state.isLoading = true
    state.error = null

    try {
      // Save preference
      localStorage.setItem('luxury_currency', currencyCode)
      
      // Update state
      state.currentCurrency = currency
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('currency-changed', {
        detail: { currency: currencyCode }
      }))
      
      // Add to conversion history
      addToConversionHistory({
        from: state.currentCurrency.code,
        to: currencyCode,
        rate: getExchangeRate.value(state.currentCurrency.code, currencyCode),
        timestamp: new Date()
      })
      
    } catch (err: any) {
      state.error = err.message
      throw err
    } finally {
      state.isLoading = false
    }
  }

  const fetchExchangeRates = async () => {
    state.isLoading = true
    state.error = null

    try {
      // Try to fetch live rates
      const rates = await getExchangeRates()
      state.exchangeRates = rates
      
      // Update currency rates
      updateCurrencyRates(rates)
      
      state.lastUpdated = new Date()
      
      // Cache rates
      cacheExchangeRates(rates)
      
    } catch (err) {
      console.warn('Using cached exchange rates')
      
      // Fallback to cached rates
      const cachedRates = getCachedRates()
      if (cachedRates) {
        state.exchangeRates = cachedRates
        updateCurrencyRates(cachedRates)
      }
      
      state.error = 'Using cached exchange rates'
    } finally {
      state.isLoading = false
    }
  }

  const convert = async (amount: number, from: string, to: string): Promise<number> => {
    try {
      state.isLoading = true
      
      // Get conversion rate
      const rate = getExchangeRate.value(from, to)
      const convertedAmount = amount * rate
      
      // Add to history
      addToConversionHistory({
        from,
        to,
        amount,
        convertedAmount,
        rate,
        timestamp: new Date()
      })
      
      return convertedAmount
      
    } catch (err: any) {
      state.error = err.message
      throw err
    } finally {
      state.isLoading = false
    }
  }

  const formatPrice = (price: number, currencyCode?: string): string => {
    const currency = currencyCode 
      ? availableCurrencies.value.find(c => c.code === currencyCode)
      : state.currentCurrency
    
    if (!currency) return `${price}`
    
    const formatted = new Intl.NumberFormat(getLocale(currency.code), {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price / currency.rate)
    
    return formatted
  }

  const formatExchangeRate = (rate: number): string => {
    return rate.toFixed(4)
  }

  const refreshRates = async () => {
    await fetchExchangeRates()
    
    // Show notification
    showNotification({
      type: 'success',
      title: 'Exchange Rates Updated',
      message: `Rates refreshed at ${new Date().toLocaleTimeString()}`
    })
  }

  const clearError = () => {
    state.error = null
  }

  const clearHistory = () => {
    state.conversionHistory = []
    localStorage.removeItem('luxury_conversion_history')
  }

  // Helper methods
  const setPopularCurrencies = () => {
    // Set luxury currencies + current currency as popular
    state.popularCurrencies = [
      ...luxuryCurrencies.value,
      state.currentCurrency
    ].filter((currency, index, self) => 
      self.findIndex(c => c.code === currency.code) === index
    ).slice(0, 6) // Limit to 6 currencies
  }

  const updateCurrencyRates = (rates: ExchangeRate[]) => {
    rates.forEach(rate => {
      const currency = availableCurrencies.value.find(c => c.code === rate.to)
      if (currency) {
        currency.rate = rate.rate
      }
    })
  }

  const cacheExchangeRates = (rates: ExchangeRate[]) => {
    localStorage.setItem('luxury_exchange_rates', JSON.stringify({
      rates,
      timestamp: new Date().getTime()
    }))
  }

  const getCachedRates = (): ExchangeRate[] | null => {
    const cached = localStorage.getItem('luxury_exchange_rates')
    if (!cached) return null
    
    try {
      const { rates, timestamp } = JSON.parse(cached)
      
      // Check if cache is older than 1 hour
      const oneHour = 60 * 60 * 1000
      if (Date.now() - timestamp > oneHour) {
        return null
      }
      
      return rates
    } catch {
      return null
    }
  }

  const addToConversionHistory = (conversion: CurrencyConversion) => {
    state.conversionHistory.unshift(conversion)
    
    // Keep only last 50 conversions
    if (state.conversionHistory.length > 50) {
      state.conversionHistory.pop()
    }
    
    // Save to localStorage
    localStorage.setItem('luxury_conversion_history', 
      JSON.stringify(state.conversionHistory.slice(0, 20))
    )
  }

  const getLocale = (currencyCode: string): string => {
    const locales: Record<string, string> = {
      'USD': 'en-US',
      'EUR': 'de-DE',
      'GBP': 'en-GB',
      'AED': 'ar-AE',
      'SAR': 'ar-SA',
      'QAR': 'ar-QA',
      'KWD': 'ar-KW',
      'EGP': 'ar-EG',
      'JPY': 'ja-JP',
      'CNY': 'zh-CN',
      'CHF': 'de-CH',
      'CAD': 'en-CA'
    }
    
    return locales[currencyCode] || 'en-US'
  }

  const showNotification = (notification: {
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
  }) => {
    window.dispatchEvent(new CustomEvent('luxury-notification', {
      detail: notification
    }))
  }

  // Initialize
  initializeCurrency()

  return {
    // State
    currentCurrency,
    exchangeRates,
    popularCurrencies,
    isLoading,
    error,
    lastUpdated,
    conversionHistory,

    // Getters
    availableCurrencies: formattedCurrencies,
    luxuryCurrencies,
    currencyOptions,
    getCurrencyByCode,
    getExchangeRate,

    // Actions
    setCurrency,
    fetchExchangeRates,
    convert,
    formatPrice,
    formatExchangeRate,
    refreshRates,
    clearError,
    clearHistory,
    initializeCurrency
  }
})

// Types (should be in @/types/currency.ts)
export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  rate: number
  isLuxury?: boolean
}

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  timestamp: Date
}

export interface CurrencyConversion {
  from: string
  to: string
  amount?: number
  convertedAmount?: number
  rate: number
  timestamp: Date
}

export interface CurrencyStoreState {
  currentCurrency: Currency
  exchangeRates: ExchangeRate[]
  popularCurrencies: Currency[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  conversionHistory: CurrencyConversion[]
}

// Create currency service (src/services/currencyService.ts)
export const currencyService = {
  async getExchangeRates(): Promise<ExchangeRate[]> {
    // In production, replace with real API call
    // Example: fetch('https://api.exchangerate-api.com/v4/latest/USD')
    
    // Mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { from: 'USD', to: 'EUR', rate: 0.92, timestamp: new Date() },
          { from: 'USD', to: 'GBP', rate: 0.79, timestamp: new Date() },
          { from: 'USD', to: 'AED', rate: 3.67, timestamp: new Date() },
          { from: 'USD', to: 'SAR', rate: 3.75, timestamp: new Date() },
          { from: 'USD', to: 'QAR', rate: 3.64, timestamp: new Date() },
          { from: 'USD', to: 'KWD', rate: 0.31, timestamp: new Date() },
          { from: 'USD', to: 'EGP', rate: 30.9, timestamp: new Date() },
          { from: 'USD', to: 'JPY', rate: 148.5, timestamp: new Date() }
        ])
      }, 500)
    })
  },

  async getCurrencyRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    const rates = await this.getExchangeRates()
    const result: Record<string, number> = { [baseCurrency]: 1 }
    
    rates.forEach(rate => {
      if (rate.from === baseCurrency) {
        result[rate.to] = rate.rate
      }
    })
    
    return result
  },

  async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    const rates = await this.getCurrencyRates(from)
    const rate = rates[to] || 1
    return amount * rate
  }
}