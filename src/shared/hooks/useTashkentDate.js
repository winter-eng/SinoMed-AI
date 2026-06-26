import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const MONTHS = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
}
const WEEKDAYS = {
  uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
}

// Returns current date in Tashkent (UTC+5) regardless of device timezone
function getTashkentDate() {
  const now = new Date()
  return new Date(now.getTime() + (now.getTimezoneOffset() + 300) * 60000)
}

export function useTashkentDate() {
  const { i18n } = useTranslation()
  const [date, setDate] = useState(getTashkentDate)

  useEffect(() => {
    // Schedule refresh at the next Tashkent midnight
    const d = getTashkentDate()
    const msToMidnight =
      (23 - d.getHours()) * 3600000 +
      (59 - d.getMinutes()) * 60000 +
      (60 - d.getSeconds()) * 1000

    const timeout = setTimeout(() => {
      setDate(getTashkentDate())
      const interval = setInterval(() => setDate(getTashkentDate()), 86400000)
      return () => clearInterval(interval)
    }, msToMidnight)

    return () => clearTimeout(timeout)
  }, [])

  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz'
  const day = date.getDate()
  const month = date.getMonth()
  const weekday = date.getDay()

  if (lang === 'ru') {
    return `${day} ${MONTHS.ru[month]}, ${WEEKDAYS.ru[weekday]}`
  }
  return `${day}-${MONTHS.uz[month]}, ${WEEKDAYS.uz[weekday]}`
}
