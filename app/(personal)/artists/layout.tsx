export default function ArtistsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      {children}
    </div>
  )
}
