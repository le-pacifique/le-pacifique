export default function ArtistsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="site-section-shell h-full w-full flex items-center justify-center">
      {children}
    </div>
  )
}
