export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "INR"

export function formatCurrency(amount: number, currency: Currency = "INR"): string {
  const localeMap: Record<Currency, string> = {
    USD: "en-US",
    EUR: "en-GB",
    GBP: "en-GB",
    CAD: "en-CA",
    INR: "en-IN",
  }

  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number, currency: Currency = "INR"): string {
  // Special formatting for INR (Indian numbering system)
  if (currency === "INR") {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
  } else {
    // Standard formatting for other currencies
    if (amount >= 1000000) {
      return formatCurrency(amount / 1000000, currency).replace(
        /[\d,.-]+/,
        (match) => `${Number.parseFloat(match).toFixed(1)}M`,
      )
    } else if (amount >= 1000) {
      return formatCurrency(amount / 1000, currency).replace(
        /[\d,.-]+/,
        (match) => `${Number.parseFloat(match).toFixed(1)}K`,
      )
    }
  }

  return formatCurrency(amount, currency)
}

export function getUserCurrency(): Currency {
  if (typeof window !== "undefined") {
    const savedCurrency = localStorage.getItem("userCurrency") as Currency
    return savedCurrency || "INR"
  }
  return "INR"
}

export function setUserCurrency(currency: Currency): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userCurrency", currency)
  }
}
