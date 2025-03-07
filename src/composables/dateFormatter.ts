class DateFormatter {
  locale = navigator.language ? navigator.language : 'fr'

  format(
    date: string | Date = new Date(),
    format: Intl.DateTimeFormatOptions = {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  ) {
    return Intl.DateTimeFormat(this.locale, format).format(new Date(date))
  }
}
export const dateFormatter = () => new DateFormatter()
