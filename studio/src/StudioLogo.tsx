const studioLogoSrc = new URL('./iconpcfq.png', import.meta.url).href

export default function StudioLogo() {
  return (
    <img
      src={studioLogoSrc}
      alt="Le Pacifique"
      style={{
        height: '1.5rem',
        objectFit: 'contain',
        width: '1.5rem',
      }}
    />
  )
}
