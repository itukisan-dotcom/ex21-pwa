export function jstToday(now = new Date()) { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(now); }
export function shiftDate(day, offset) { const d = new Date(`${day}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10); }
export function deadline(day) { return shiftDate(day, -21); }
export function expired(day, now = new Date()) { return now.getTime() > new Date(`${deadline(day)}T23:30:00+09:00`).getTime(); }
export function calendar(trip) {
 const date = deadline(trip.date).replaceAll('-', '');
 const escape = s => s.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EX21//JA','BEGIN:VEVENT',`UID:${trip.id}@ex21-pwa`,`DTSTAMP:${new Date().toISOString().replaceAll('-','').replaceAll(':','').replace(/\.\d{3}/,'')}`,`DTSTART:${date}T130000Z`,`DTEND:${date}T133000Z`,`SUMMARY:${escape('EX早特21の購入確認')}`,`DESCRIPTION:${escape(`${trip.from} → ${trip.to} / 乗車日 ${trip.date}。締切は日本時間23:30。購入は公式サイトで手動。`)}`,'BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:EX早特21の購入確認','END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
