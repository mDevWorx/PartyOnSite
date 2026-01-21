import { useCallback, useState } from 'react'
import { toPng } from 'html-to-image'

const useShareImage = () => {
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadCard = useCallback(
    async (target: HTMLElement | null, fileName: string) => {
      if (!target || isGenerating) {
        return
      }

      const rect = target.getBoundingClientRect()

      setIsGenerating(true)
      try {
        const dataUrl = await toPng(target, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          width: rect.width,
          height: rect.height,
        })

        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `${fileName}.png`
        link.click()
      } catch (error) {
        console.error('Failed to generate share image', error)
      } finally {
        setIsGenerating(false)
      }
    },
    [isGenerating],
  )

  return { downloadCard, isGenerating }
}

export default useShareImage
