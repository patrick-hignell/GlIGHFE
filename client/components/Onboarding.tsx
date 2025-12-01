import { useEffect } from 'react'
import EmblaCarousel from './Embla'

function Onboarding() {
  const glyphArray: string[] = [
    'Glyph-ee',
    'Gee Life',
    'Glig-hefe',
    'Glyphee-ee',
    'Gli-ephee',
    'Gly-phae',
    'Glif-phi',
    'Gl-eye-dge-fee',
    'Jih-lif',
    'Glee-guff',
    'G-luffe',
    'Gellig-huiffer',
    'Jelly-geef',
  ]
  const Glyph = glyphArray
  const currentGlyph = Glyph[random(0, Glyph.length - 1)]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="relative flex h-screen min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-green-200 to-green-500 p-4 text-center font-body">
      <h1 className="mb-5 mt-5 text-5xl font-bold underline">
        What is GlIFGHE
      </h1>

      <EmblaCarousel
        textBoxes={[
          `GlIFGHE (pronounced ${currentGlyph}) is a social media platform that communicates through pure visual signal: icons, symbols, 
          and images designed for universal interpretation—no language required.`,
          'Within this system, text does not exist. No words, No captions, No written markers of any kind.',
          'GlIFGHE leverages visual communication to drive authentic user engagement. Zero text, zero barriers. See with eyes. Think with heart.Your journey begins.',
          'THAR BE NO WORDS NOR TEXT BEYOND THIS POINT, ON ME HONOR!',
        ]}
      />
      <footer className="absolute bottom-0 left-0 right-0 p-4 text-white"></footer>
    </div>
  )
}
export default Onboarding

function random(min: number, max: number): number {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return num
}
