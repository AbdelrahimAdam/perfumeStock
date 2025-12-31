import type { ExchangeRate } from '@/types/currency'

const API_BASE_URL = import.meta.env.VITE_CURRENCY_API_URL || 'https://api.exchangerate-api.com/v4'
const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY

export const getExchangeRates = async (): Promise<ExchangeRate[]> => {
  try {
    // Production API call
    const response = await fetch(`${API_BASE_URL}/latest/USD`, {
      headers: API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}
    })
    
    if (!response.ok) {
      throw new Error(`Currency API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Convert API response to our format
    const rates: ExchangeRate[] = Object.entries(data.rates).map(([to, rate]) => ({
      from: data.base,
      to,
      rate: rate as number,
      timestamp: new Date(data.date)
    }))
    
    return rates
    
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    
    // Fallback to mock data
    return getMockExchangeRates()
  }
}

export const getCurrencyRates = async (baseCurrency: string = 'USD'): Promise<Record<string, number>> => {
  const rates = await getExchangeRates()
  const result: Record<string, number> = { [baseCurrency]: 1 }
  
  rates.forEach(rate => {
    if (rate.from === baseCurrency) {
      result[rate.to] = rate.rate
    }
  })
  
  return result
}

export const convertCurrency = async (amount: number, from: string, to: string): Promise<number> => {
  const rates = await getCurrencyRates(from)
  const rate = rates[to] || 1
  return amount * rate
}

// Mock data for development
const getMockExchangeRates = (): ExchangeRate[] => {
  const timestamp = new Date()
  
  return [
    { from: 'USD', to: 'EUR', rate: 0.92, timestamp },
    { from: 'USD', to: 'GBP', rate: 0.79, timestamp },
    { from: 'USD', to: 'AED', rate: 3.67, timestamp },
    { from: 'USD', to: 'SAR', rate: 3.75, timestamp },
    { from: 'USD', to: 'QAR', rate: 3.64, timestamp },
    { from: 'USD', to: 'KWD', rate: 0.31, timestamp },
    { from: 'USD', to: 'EGP', rate: 30.9, timestamp },
    { from: 'USD', to: 'JPY', rate: 148.5, timestamp },
    { from: 'USD', to: 'CNY', rate: 7.18, timestamp },
    { from: 'USD', to: 'CHF', rate: 0.88, timestamp },
    { from: 'USD', to: 'CAD', rate: 1.36, timestamp }
  ]
}

// Cache mechanism
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

let cachedRates: ExchangeRate[] | null = null
let cacheTimestamp: number | null = null

export const getCachedExchangeRates = (): ExchangeRate[] | null => {
  if (!cachedRates || !cacheTimestamp) return null
  
  if (Date.now() - cacheTimestamp > CACHE_DURATION) {
    cachedRates = null
    cacheTimestamp = null
    return null
  }
  
  return cachedRates
}

export const setCachedExchangeRates = (rates: ExchangeRate[]) => {
  cachedRates = rates
  cacheTimestamp = Date.now()
}