const agenda = {
    '01-10-2025': { 13: 'livre', 14: 'ocupado', 15: 'livre', 16: 'livre', 17: 'livre', 18: 'livre' },
    '02-10-2025': { 13: 'livre', 14: 'livre', 15: 'livre', 16: 'livre', 17: 'livre', 18: 'livre' },
    '03-10-2025': { 13: 'ocupado', 14: 'livre', 15: 'ocupado', 16: 'livre', 17: 'livre', 18: 'livre' },
    '04-10-2025': { 13: 'livre', 14: 'livre', 15: 'livre', 16: 'livre', 17: 'ocupado', 18: 'livre' },
    '05-10-2025': "não abre",
    '06-10-2025': "não abre",
    '07-10-2025': { 13: 'livre', 14: 'livre', 15: 'ocupado', 16: 'ocupado', 17: 'ocupado', 18: 'livre' },
}
const freeDays = Object.entries(agenda).map(([day, hours]) => {
    const canDoIt = Object.keys(hours).filter(horario => hours[horario] === 'livre');
    if (canDoIt.length > 0) {
        return `(${day} / horas com vaga: ${canDoIt.join(', ')})`;
    }
    return null;
}).filter(item => item !== null).join("");

export default freeDays;