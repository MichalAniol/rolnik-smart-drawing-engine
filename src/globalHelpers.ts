const globalHelpers = (function () {
    const getDateAtNoonInXDays = (daysPlus: number, date?: number): number => {
        const newDate = date ? new Date(date) : new Date()

        const targetDate = new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate() + daysPlus,
            12, 0, 0, 0
        )

        return targetDate.getTime();
    }

    const isSameDay = (date1Ms: number, date2Ms: number): boolean => {
        const date1 = new Date(date1Ms)
        const date2 = new Date(date2Ms)

        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    return {
        getDateAtNoonInXDays,
        isSameDay,
    }
}())