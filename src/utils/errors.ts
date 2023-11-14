const squash = (str: string) => str.replaceAll(' ', '').replaceAll(/(\r\n|\n|\r)/gm, '')

// Viem tends to insert random newlines into error messages, so we need to squash them.
const messageMap = Object.entries({ '': '' }).reduce(
  (acc, [key, value]) => {
    acc[squash(key)] = value
    return acc
  },
  {} as Record<string, string>,
)

export function simplifyViemError(error: string | undefined): string | undefined {
  if (!error) return error
  const result = messageMap[squash(error)]
  return result ? result : `An unknown error occurred: "${error}".`
}
