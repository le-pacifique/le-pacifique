export default function BlogLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-svh w-full bg-[#9D9998]">{children}</div>
}
