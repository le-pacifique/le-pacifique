export default function BlogLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <div className="site-section-shell min-h-svh w-full bg-[#9D9998]">{children}</div>
}
