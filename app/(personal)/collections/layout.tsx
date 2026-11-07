export default function CollectionsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <div className="site-section-shell bg-[#FF4517] h-full w-full">{children}</div>
}