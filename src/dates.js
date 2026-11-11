export function jstToday(now = new Date()) { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(now); }
export function shiftDate(day, offset) { const d = new Date(`${day}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10); }
export function deadline(day) { return shiftDate(day, -21); }
export function expired(day, now = new Date()) { return now.getTime() > new Date(`${deadline(day)}T23:30:00+09:00`).getTime(); }
export function releaseDate(day) {
 const [year, month, date] = day.split('-').map(Number);
 const candidate = new Date(Date.UTC(year, month - 2, date));
 return (candidate.getUTCMonth() === (month + 10) % 12 ? candidate : new Date(Date.UTC(year, month - 1, 1))).toISOString().slice(0,10);
}
export function releaseAt(day) { return new Date(`${releaseDate(day)}T10:00:00+09:00`); }
export function countdown(day, now = new Date()) {
 const seconds = Math.max(0, Math.ceil((releaseAt(day).getTime() - now.getTime()) / 1000));
 return { days:Math.floor(seconds/86400), hours:Math.floor(seconds/3600)%24, minutes:Math.floor(seconds/60)%60, seconds:seconds%60 };
}
export function calendar(trip) {
 const date = deadline(trip.date).replaceAll('-', '');
 const escape = s => s.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EX21//JA','BEGIN:VEVENT',`UID:${trip.id}@ex21-pwa`,`DTSTAMP:${new Date().toISOString().replaceAll('-','').replaceAll(':','').replace(/\.\d{3}/,'')}`,`DTSTART:${date}T130000Z`,`DTEND:${date}T133000Z`,`SUMMARY:${escape('EX早特21の購入確認')}`,`DESCRIPTION:${escape(`${trip.from} → ${trip.to} / 乗車日 ${trip.date}。締切は日本時間23:30。購入は公式サイトで手動。`)}`,'BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:EX早特21の購入確認','END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
