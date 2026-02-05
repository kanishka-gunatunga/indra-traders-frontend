// Time slot constants (shared across both dashboards)
export const TIME_SLOT_START = 8 * 60; // 8:00 AM in minutes
export const TIME_SLOT_END = 17 * 60;   // 5:00 PM in minutes
export const TIME_SLOT_INTERVAL = 30;   // 30 minutes

export interface TimeSlot {
    start: string;  // "HH:mm"
    end: string;    // "HH:mm"
    label: string; // "HH:mm - HH:mm"
}

export function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}

export function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export function generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let start = TIME_SLOT_START;

    while (start < TIME_SLOT_END) {
        const startH = Math.floor(start / 60).toString().padStart(2, '0');
        const startM = (start % 60).toString().padStart(2, '0');
        const endMins = start + TIME_SLOT_INTERVAL;
        const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
        const endM = (endMins % 60).toString().padStart(2, '0');

        slots.push({
            start: `${startH}:${startM}`,
            end: `${endH}:${endM}`,
            label: `${startH}:${startM} - ${endH}:${endM}`,
        });
        start += TIME_SLOT_INTERVAL;
    }
    return slots;
}

export function generateTimeSlotStrings(
    startTime: string = "08:00",
    endTime: string = "17:00",
    slotDurationMinutes: number = TIME_SLOT_INTERVAL
): string[] {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const slots: string[] = [];
    
    let currentMinutes = startMinutes;
    while (currentMinutes < endMinutes) {
        const slotTime = minutesToTime(currentMinutes);
        slots.push(slotTime);
        currentMinutes += slotDurationMinutes;
    }

    return slots;
}

export function calculateTotalTimeSlots(): number {
    let count = 0;
    let start = TIME_SLOT_START;
    while (start < TIME_SLOT_END) {
        count++;
        start += TIME_SLOT_INTERVAL;
    }
    return count;
}
