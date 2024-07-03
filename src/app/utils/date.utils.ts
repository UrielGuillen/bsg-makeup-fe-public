import { add, format, getDate, sub } from 'date-fns';

import { Agenda } from '../interfaces/agenda-interface';
import { Appointments } from '../interfaces/appointments.interface';
import { ServicesCatalog } from '../interfaces/services-catalog.interface';

export function getCurrentDay(date: Date): number {
  return getDate(date);
}

export function getDayName(date: Date): string {
  return format(date, 'EEEE');
}

export function getMonthName(date: Date): string {
  return format(date, 'MMMM');
}

export function moveOneDayForward(date: Date): Date {
  return add(date, { days: 1 });
}

export function moveOneDayBack(date: Date): Date {
  return sub(date, { days: 1 });
}

export function getAvailableHours(): Array<Agenda> {
  return [
    { id: 1, hour: '08:00' },
    { id: 2, hour: '08:30' },
    { id: 3, hour: '09:00' },
    { id: 4, hour: '09:30' },
    { id: 5, hour: '10:00' },
    { id: 6, hour: '10:30' },
    { id: 7, hour: '11:00' },
    { id: 8, hour: '11:30' },
    { id: 9, hour: '12:00' },
    { id: 10, hour: '12:30' },
    { id: 11, hour: '13:00' },
    { id: 12, hour: '13:30' },
    { id: 13, hour: '14:00' },
    { id: 14, hour: '14:30' },
    { id: 15, hour: '15:00' },
    { id: 16, hour: '15:30' },
    { id: 17, hour: '16:00' },
    { id: 18, hour: '16:30' },
    { id: 19, hour: '17:00' },
    { id: 20, hour: '17:30' },
    { id: 21, hour: '18:00' },
    { id: 22, hour: '18:30' },
    { id: 23, hour: '19:00' },
    { id: 24, hour: '19:30' },
    { id: 25, hour: '20:00' },
    { id: 26, hour: '20:30' },
    { id: 27, hour: '21:00' },
    { id: 28, hour: '21:30' },
  ];
}

export function calculateTimePosition(time: string): number {
  const topSpacing: number = 8;
  const rowHeight: number = 50;
  const hours: Array<Agenda> = getAvailableHours();
  const timeSlot: number = hours.findIndex((hour: Agenda) => hour.hour === time);

  return (timeSlot * rowHeight) + topSpacing;
}

export function getUnavailableHours(appointments: Array<Appointments>): Array<Agenda> {
  return appointments.reduce((unavailableHours: Array<Agenda>, appointment: Appointments) => {
    const hours: Array<Agenda> = [ ...getAvailableHours() ];
    const timeSlot: number = hours.findIndex((hour: Agenda) => hour.hour === appointment.time);
    const rowsForward: number = Math.round(appointment.serviceTime / 30);

    unavailableHours = unavailableHours.concat(hours.splice(timeSlot, rowsForward));

    return unavailableHours;
  }, []).filter(
    (hour: Agenda, index: number, initial: Array<Agenda>)=>
      initial.findIndex((item: Agenda)=>( item.id === hour.id )) === index,
  );
}

export function getServiceEndTimeAvailable(service: ServicesCatalog | undefined, startTime: string): string {
  const hours: Array<Agenda> = [ ...getAvailableHours() ];

  if (service) {
    const timeSlot: number = hours.findIndex((hour: Agenda) => hour.hour === startTime);
    const rowsForward: number = Math.round(service.time / 30);
    const endTimeIndex: number = timeSlot + rowsForward;

    return hours[endTimeIndex].hour;
  }

  return '';
}

export function calculateAppointmentHeight(time: number): number {
  const rowHeight: number = 50;
  const minutesPerRow: number = 30;
  // Consider that the appointment container has 8px of padding.
  const fitIntoRows: number = 28;
  const rowsToFill: number = Math.round(time / minutesPerRow);

  return ((rowsToFill * rowHeight) - fitIntoRows);
}

export function formatScheduledDate(scheduledDate: Date): string {
  return format(scheduledDate, 'MM/dd/yyyy');
}
