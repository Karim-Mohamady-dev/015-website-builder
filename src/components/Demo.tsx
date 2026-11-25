import { useState } from 'react'
import type { DragEvent } from 'react'
import { CheckCircle, Desktop, DeviceMobile, Plus, Rocket, Trash } from '@phosphor-icons/react'
import type { Dict, TArrFn, TFn } from '../App.tsx'

type Block = { id: number; type: string; label: string }

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export default function Demo({ t, ta }: { t: TFn; ta: TArrFn }) {
  const palette = ta('demo.blocks')
  const [canvas, setCanvas] = useState<Block[]>(() =>
    ta('demo.starter').map((b, i) => ({ id: i + 1, type: str(b.type), label: str(b.label) })),
  )
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [nextId, setNextId] = useState(100)
  const [published, setPublished] = useState(false)

  const addBlock = (type: string, label: string) => {
    setCanvas((prev) => [...prev, { id: nextId, type, label }])
    setNextId(nextId + 1)
    setPublished(false)
  }

  const onDragStart = (e: DragEvent, type: string, label: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, label }))
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain')) as Dict
      addBlock(str(data.type), str(data.label))
    } catch {
      // ignore invalid drops
    }
  }

  const removeBlock = (id: number) => {
    setCanvas((prev) => prev.filter((b) => b.id !== id))
    setPublished(false)
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="title-2">{t('demo.boardTitle')}</p>
        <div className="flex items-center rounded-xl border border-line p-1" role="group" aria-label={t('demo.deviceLabel')}>
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            aria-pressed={device === 'desktop'}
            className={`button-sm inline-flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-300 ${device === 'desktop' ? 'bg-accent text-white' : 'text-muted hover:text-ink'}`}
          >
            <Desktop size={16} />
            {t('demo.desktop')}
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            aria-pressed={device === 'mobile'}
            className={`button-sm inline-flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-300 ${device === 'mobile' ? 'bg-accent text-white' : 'text-muted hover:text-ink'}`}
          >
            <DeviceMobile size={16} />
            {t('demo.mobile')}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div>
          <p className="title-3">{t('demo.paletteLabel')}</p>
          <p className="caption-2 mt-2 text-muted">{t('demo.paletteHint')}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {palette.map((b, i) => (
              <li
                key={i}
                draggable
                onDragStart={(e) => onDragStart(e, str(b.type), str(b.label))}
                className="flex items-center justify-between gap-2 rounded-xl border border-line bg-paper p-4"
              >
                <span className="body-5 cursor-grab">{str(b.label)}</span>
                <button
                  type="button"
                  onClick={() => addBlock(str(b.type), str(b.label))}
                  aria-label={`${t('demo.addBlock')} ${str(b.label)}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line transition-colors duration-300 hover:border-accent"
                >
                  <Plus size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setPublished(true)}
              disabled={canvas.length === 0}
              className="button-md inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-40"
            >
              <Rocket size={16} />
              {t('demo.publish')}
            </button>
            <button
              type="button"
              onClick={() => {
                setCanvas([])
                setPublished(false)
              }}
              className="button-md rounded-xl border border-line px-3 py-2 transition-colors duration-300 hover:border-accent"
            >
              {t('demo.clear')}
            </button>
          </div>
          {published && (
            <p role="status" className="body-5 mt-4 flex items-center gap-2 rounded-xl border border-line bg-paper px-4 py-2">
              <CheckCircle size={18} className="shrink-0 text-accent" />
              {t('demo.publishedMessage')}
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          <p className="title-3">{t('demo.canvasLabel')}</p>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={`mx-auto mt-4 min-h-96 rounded-2xl border-2 border-dashed border-line bg-paper p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${device === 'mobile' ? 'max-w-[320px]' : 'w-full'}`}
            aria-label={t('demo.canvasLabel')}
          >
            {canvas.length === 0 ? (
              <p className="body-3 flex h-64 items-center justify-center text-center text-muted">{t('demo.empty')}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {canvas.map((block) => (
                  <li key={block.id} className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-surface p-4">
                    <span className="body-5">
                      {block.type === 'hero' && <span className="heading-4 block">{block.label}</span>}
                      {block.type === 'text' && <span className="body-3 block">{block.label}</span>}
                      {block.type === 'image' && <span className="flex h-24 items-center justify-center rounded-lg bg-accent/10 text-accent">{block.label}</span>}
                      {block.type === 'button' && <span className="button-md inline-flex rounded-xl bg-accent px-3 py-2 text-white">{block.label}</span>}
                      {block.type === 'form' && <span className="body-5 block rounded-lg border border-line bg-paper px-3 py-2">{block.label}</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      aria-label={t('demo.remove')}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line transition-colors duration-300 hover:border-red-500 hover:text-red-600"
                    >
                      <Trash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="caption-5 mt-4 text-muted">{t('demo.note')}</p>
        </div>
      </div>
    </div>
  )
}
