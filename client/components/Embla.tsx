import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType } from 'embla-carousel'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

type PropType = {
  textBoxes: string[]
  options?: EmblaOptionsType
}

const EmblaCarousel = (props: PropType) => {
  const { textBoxes = [], options } = props // Added default
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const isLastSlide = currentIndex === textBoxes.length - 1

  return (
    <section className="w-full overflow-hidden">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {textBoxes.map((text, index) => (
            <div
              className="h-60% flex min-w-0 flex-[0_0_100%] items-center justify-center p-8"
              key={index}
            >
              <div className="max-w-2xl text-center text-3xl">
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!isLastSlide && <p className="text-5xl">➽➽➽</p>}
      {isLastSlide && (
        <button
          onClick={() => {
            navigate('/feed')
            // another useQuery maybe to check the user is in the database
          }}
          className="hover:bg-success-strong focus:ring-success-medium shadow-xs text-md ml-7 box-border rounded-xl border-2 border-black bg-lime-400 p-0.5 px-4 py-2.5 font-bold leading-5 focus:outline-none focus:ring-4"
        >
          I AGREE I WILL USE NO TEXT
        </button>
      )}
    </section>
  )
}

export default EmblaCarousel
