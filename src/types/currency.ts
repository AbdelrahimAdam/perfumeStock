export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  rate: number
  isLuxury?: boolean
  formattedRate?: string
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

export interface CurrencyOption {
  value: string
  label: string
  symbol: string
}