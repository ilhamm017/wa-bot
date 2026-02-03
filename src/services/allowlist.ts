function normalizeWhatsAppId(value: string): string | null {
    const trimmed = value.trim()
    if (!trimmed) return null

    if (trimmed.includes('@')) return trimmed.toLowerCase()

    const digits = trimmed.replace(/[^\d]/g, '')
    if (!digits) return null

    return `${digits}@c.us`
}

function parseAllowlist(envValue: string | undefined): Set<string> | null {
    if (!envValue) return null

    const entries = envValue
        .split(/[,\n]/g)
        .map(v => normalizeWhatsAppId(v))
        .filter((v): v is string => Boolean(v))

    return new Set(entries)
}

const allowedChatIds = parseAllowlist(process.env.WA_ALLOWED_NUMBERS)

export function isAllowedChatId(chatId: string): boolean {
    if (!allowedChatIds) return true
    return allowedChatIds.has(chatId.toLowerCase())
}

