import numbro from 'numbro'

export const formatDollarAmount = (num: number | string | undefined, digits = 2) => {
  if (typeof num === 'string') {
    num = parseFloat(num)
  }

  if (num === 0) return '$0.00'
  if (!num) return '-'
  if (num < 0.001 && digits <= 3) {
    return '<$0.001'
  }

  return numbro(num).formatCurrency({
    thousandSeparated: true,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B',
    },
  })
}

export const formatAmount = (num: number | string | undefined, digits?: number) => {
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  if (num === 0) return '0'
  if (!num) return '-'

  if (num > 0 && num < 0.01) {
    return '<0.01'
  }
  if (num < 0 && num > -0.01) {
    return '<0.01'
  }

  // make sure the digits (in this case 2) is gte to the
  // decimals places of the sanity check earlier above
  const mantissa = digits || (num > 1000 ? 0 : 2)

  return numbro(num).format({
    thousandSeparated: true,
    mantissa: mantissa,
  })
}
