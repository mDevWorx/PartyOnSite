import { useEffect } from 'react'

const useThemeClass = (theme?: string | null) => {
  const isBoysTheme = theme === 'boys'

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.classList.toggle('boys-body', isBoysTheme)
    return () => {
      document.body.classList.remove('boys-body')
    }
  }, [isBoysTheme])

  return { isBoysTheme }
}

export default useThemeClass
