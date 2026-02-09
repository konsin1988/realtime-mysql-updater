export function formatRuDate(date: string): string {
    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ];

    const [year, month, day] = date.split("-");

    const dayNum = String(Number(day));
    const monthName = months[Number(month) - 1];

    return `"${dayNum}" ${monthName} ${year} г.`;
}
