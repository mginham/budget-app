// Helper function to get ordinal suffix for a number
export function getOrdinalSuffix(day) {
    const j = day % 10,
        k = day % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
}
