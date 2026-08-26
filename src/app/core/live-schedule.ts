export interface WorshipService {
  id: string;
  title: string;
  description: string;
  /** 0 = domingo … 6 = sábado */
  day: number;
  hour: number;
  minute: number;
  durationMinutes: number;
  scheduleLabel: string;
}

export const WEEKLY_WORSHIP_SERVICES: WorshipService[] = [
  {
    id: 'viernes-gloria',
    title: 'Viernes de gloria',
    description: 'Noche de fe y milagros',
    day: 5,
    hour: 19,
    minute: 0,
    durationMinutes: 150,
    scheduleLabel: 'Viernes | 7:00 PM',
  },
  {
    id: 'ayunos',
    title: 'Ayunos',
    description: 'Dedicación y consagración',
    day: 6,
    hour: 8,
    minute: 30,
    durationMinutes: 120,
    scheduleLabel: 'Sábado | 8:30 AM',
  },
  {
    id: 'reunion-juvenil',
    title: 'Reunión Juvenil',
    description: 'Juventud en acción y adoración',
    day: 6,
    hour: 18,
    minute: 0,
    durationMinutes: 120,
    scheduleLabel: 'Sábado | 6:00 PM',
  },
  {
    id: 'dominical',
    title: 'Servicios Dominicales',
    description: 'Adoración y enseñanza de la Palabra',
    day: 0,
    hour: 9,
    minute: 0,
    durationMinutes: 150,
    scheduleLabel: 'Domingos | 9:00 AM',
  },
];

export interface LiveStatus {
  isLive: boolean;
  current: WorshipService | null;
  next: { service: WorshipService; start: Date } | null;
}

function bogotaNow(date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const hour = get('hour') === 24 ? 0 : get('hour');

  return new Date(get('year'), get('month') - 1, get('day'), hour, get('minute'), get('second'));
}

function serviceStartOnWeek(reference: Date, service: WorshipService, weekOffset: number): Date {
  const start = new Date(reference);
  const delta = service.day - start.getDay() + weekOffset * 7;
  start.setDate(start.getDate() + delta);
  start.setHours(service.hour, service.minute, 0, 0);
  return start;
}

export function getLiveStatus(now = new Date()): LiveStatus {
  const bogota = bogotaNow(now);
  let current: WorshipService | null = null;
  let next: LiveStatus['next'] = null;
  let soonest = Number.POSITIVE_INFINITY;

  for (let weekOffset = 0; weekOffset <= 1; weekOffset++) {
    for (const service of WEEKLY_WORSHIP_SERVICES) {
      const start = serviceStartOnWeek(bogota, service, weekOffset);
      const end = new Date(start.getTime() + service.durationMinutes * 60_000);

      if (bogota >= start && bogota < end) {
        current = service;
      }

      if (start > bogota) {
        const wait = start.getTime() - bogota.getTime();
        if (wait < soonest) {
          soonest = wait;
          next = { service, start };
        }
      }
    }
  }

  return { isLive: current !== null, current, next };
}
