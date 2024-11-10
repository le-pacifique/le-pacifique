export default function CollectionsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <div className="h-full w-full">{children}</div>
}
