export class DateHelper {
  static today(): string {
    return new Date().toISOString().split('T')[0];
  }

  static now(): string {
    return new Date().toISOString();
  }

  static timestamp(): number {
    return Date.now();
  }

  static formatDate(date: Date, format = 'YYYY-MM-DD'): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return format.replace('YYYY', String(y)).replace('MM', m).replace('DD', d);
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
