import { useTranslation } from 'react-i18next'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { LANGUAGES } from '@/shared/constants/languages'

export function useLanguage() {
  const { i18n } = useTranslation()

  const language = i18n.language

  const setLanguage = (lang) => {
    void i18n.changeLanguage(lang)
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang)
  }

  const toggleLanguage = () => {
    setLanguage(language === LANGUAGES.UZ ? LANGUAGES.RU : LANGUAGES.UZ)
  }

  return { language, setLanguage, toggleLanguage }
}
