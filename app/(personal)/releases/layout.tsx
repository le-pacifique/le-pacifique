export default function CollectionsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <div className="bg-[#9D9998] h-full w-full">{children}</div>
}
