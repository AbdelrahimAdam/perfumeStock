import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { getExchangeRates, convertCurrency } from '@/services/currencyService'
import type {
  Currency,
  ExchangeRate,
  CurrencyConversion,
  CurrencyStoreState
} from '@/types/currency'

const BASE_CURRENCY = 'EGP'

export const useCurrencyStore = defineStore('currency', () => {
  // -------------------
  // STATE
  // -------------------
  const state = reactive<CurrencyStoreState>({
    currentCurrency: {
      code: 'EGP',
      name: 'Egyptian Pound',
      symbol: 'ج.م',
      flag: '🇪🇬',
      rate: 1
    },
    exchangeRates: [],
    popularCurrencies: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    conversionHistory: []
  })

  // -------------------
  // AVAILABLE CURRENCIES
  // (rates will be injected from API)
  // -------------------
  const availableCurrencies = ref<Currency[]>([
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م', flag: '🇪🇬', rate: 1 },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 0 },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0 },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0 },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 0, isLuxury: true },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦', rate: 0, isLuxury: true },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦', rate: 0, isLuxury: true },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼', rate: 0, isLuxury: true },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 0 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 0 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', rate: 0 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', rate: 0 }
  ])

  // -------------------
  // GETTERS
  // -------------------
  const currentCurrency = computed(() => state.currentCurrency)
  const isLoading = computed(() => state.isLoading)
  const error = computed(() => state.error)
  const exchangeRates = computed(() => state.exchangeRates)

  const luxuryCurrencies = computed(() =>
    availableCurrencies.value.filter(c => c.isLuxury)
  )

  const currencyOptions = computed(() =>
    availableCurrencies.value.map(c => ({
      value: c.code,
      label: `${c.flag} ${c.code} - ${c.name}`,
      symbol: c.symbol
    }))
  )

  const getCurrencyByCode = (code: string) =>
    availableCurrencies.value.find(c => c.code === code)

  // -------------------
  // ACTIONS
  // -------------------
  const initializeCurrency = async () => {
    state.isLoading = true
    state.error = null

    try {
      const saved = localStorage.getItem('luxury_currency')
      if (saved) {
        const found = getCurrencyByCode(saved)
        if (found) state.currentCurrency = found
      }

      await fetchExchangeRates()
      setPopularCurrencies()
    } catch (err: any) {
      state.error = err.message || 'Failed to initialize currency'
    } finally {
      state.isLoading = false
    }
  }

  const fetchExchangeRates = async () => {
    state.isLoading = true
    state.error = null

    try {
      const rates = await getExchangeRates()
      state.exchangeRates = rates

      // Inject rates into available currencies
      rates.forEach(rate => {
        const currency = getCurrencyByCode(rate.to)
        if (currency) currency.rate = rate.rate
      })

      state.lastUpdated = new Date()
    } catch (err: any) {
      state.error = err.message || 'Failed to fetch exchange rates'
      throw err
    } finally {
      state.isLoading = false
    }
  }

  const setCurrency = (currencyCode: string) => {
    const currency = getCurrencyByCode(currencyCode)
    if (!currency) throw new Error(`Currency ${currencyCode} not found`)

    state.currentCurrency = currency
    localStorage.setItem('luxury_currency', currencyCode)

    window.dispatchEvent(
      new CustomEvent('currency-changed', { detail: currencyCode })
    )
  }

  /**
   * Convert FROM EGP → selected currency
   */
  const convert = async (amountEGP: number): Promise<number> => {
    const to = state.currentCurrency.code
    const converted = await convertCurrency(amountEGP, to)

    state.conversionHistory.unshift({
      from: BASE_CURRENCY,
      to,
      amount: amountEGP,
      convertedAmount: converted,
      rate: state.currentCurrency.rate,
      timestamp: new Date()
    })

    if (state.conversionHistory.length > 50) {
      state.conversionHistory.pop()
    }

    return converted
  }

  const formatPrice = (priceEGP: number): string => {
    const currency = state.currentCurrency

    if (currency.code === BASE_CURRENCY) {
      return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP'
      }).format(priceEGP)
    }

    const converted = priceEGP * currency.rate

    return new Intl.NumberFormat(getLocale(currency.code), {
      style: 'currency',
      currency: currency.code
    }).format(converted)
  }

  const refreshRates = async () => {
    await fetchExchangeRates()
  }

  const clearError = () => (state.error = null)
  const clearHistory = () => (state.conversionHistory = [])

  // -------------------
  // HELPERS
  // -------------------
  const setPopularCurrencies = () => {
    state.popularCurrencies = [
      state.currentCurrency,
      ...luxuryCurrencies.value
    ].slice(0, 6)
  }

  const getLocale = (code: string): string => {
    const map: Record<string, string> = {
      EGP: 'ar-EG',
      USD: 'en-US',
      EUR: 'de-DE',
      GBP: 'en-GB',
      AED: 'ar-AE',
      SAR: 'ar-SA',
      QAR: 'ar-QA',
      KWD: 'ar-KW',
      JPY: 'ja-JP',
      CNY: 'zh-CN',
      CHF: 'de-CH',
      CAD: 'en-CA'
    }
    return map[code] || 'en-US'
  }

  // Init immediately
  initializeCurrency()

  return {
    currentCurrency,
    availableCurrencies,
    luxuryCurrencies,
    currencyOptions,
    exchangeRates,
    isLoading,
    error,

    initializeCurrency,
    fetchExchangeRates,
    setCurrency,
    convert,
    formatPrice,
    refreshRates,
    clearError,
    clearHistory
  }
})