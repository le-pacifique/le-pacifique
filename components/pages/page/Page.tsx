import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { Header } from '@/components/shared/Header'
import { PageScrollbarTheme } from '@/components/shared/PageScrollbarTheme'
import {
  getResolvedPageTheme,
  type SettingsTheme,
} from '@/lib/theme'
import type { PagePayload } from '@/types'

export interface PageProps {
  data: PagePayload | null
  settingsTheme?: SettingsTheme
}

export function Page({ data, settingsTheme }: PageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { backgroundColor, body, noteDrawing, overview, title } = data ?? {}
  const pageTheme = getResolvedPageTheme({
    backgroundColor,
    noteDrawing,
    section: 'pages',
    settingsTheme,
  })

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: pageTheme.backgroundColor }}
    >
      <PageScrollbarTheme backgroundColor={pageTheme.backgroundColor} />
      {pageTheme.noteDrawing?.image && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${pageTheme.noteDrawing.image})` }}
        />
      )}
      <div className="relative z-10 mb-14 h-36 flex justify-center items-center">
        {/* Header */}
        <Header title={title} description={overview} />

        {/* Body */}
        {body && (
          <CustomPortableText
            paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
            value={body}
          />
        )}
      </div>
      {/* <div className="absolute left-0 w-screen border-t" /> */}
    </div>
  )
}

export default Page
