export type ThemeColor =
  | string
  | {
      hex?: string
    }
  | null
  | undefined

export type ThemeDrawing =
  | {
      _id?: string
      title?: string
      image?: string
    }
  | null
  | undefined

export type SectionThemeKey =
  | 'home'
  | 'artists'
  | 'collections'
  | 'blog'
  | 'merch'
  | 'info'
  | 'releases'
  | 'projects'
  | 'pages'

export type PageTheme = {
  backgroundColor?: ThemeColor
  textColor?: ThemeColor
  noteDrawing?: ThemeDrawing
}

export type SettingsTheme = {
  sections?: Partial<Record<SectionThemeKey, PageTheme>>
}

export type MenuTheme = {
  sections?: Partial<
    Record<
      SectionThemeKey,
      {
        backgroundColor?: ThemeColor
        textColor?: ThemeColor
      }
    >
  >
}

export const sectionThemeKeys: SectionThemeKey[] = [
  'home',
  'artists',
  'collections',
  'blog',
  'merch',
  'info',
  'releases',
  'projects',
  'pages',
]

export const menuTitleToSection: Record<string, SectionThemeKey> = {
  Home: 'home',
  Artists: 'artists',
  Collections: 'collections',
  Blog: 'blog',
  Merch: 'merch',
  Info: 'info',
  Releases: 'releases',
  Projects: 'projects',
}

export const theme = {
  colors: {
    text: {
      default: '#000000',
      muted: 'rgba(255, 255, 255, 0.25)',
    },
    menu: {
      Artists: {
        border: '#F1FB84',
        hover: '#F1FB84',
        background: '#F1FB84',
        text: '#000000',
        // background: '#9E9E9E',
      },
      Collections: {
        border: '#c5e1a5',
        hover: '#c5e1a5',
        // background: '#9E9E9E',
        background: '#c5e1a5',
        text: '#000000',
      },
      Blog: {
        border: '#C2D9C7',
        hover: '#C2D9C7',
        background: '#9E9E9E',
        text: '#000000',
      },
      Merch: {
        border: '#EED5F4',
        hover: '#EED5F4',
        background: '#EED5F4',
        text: '#000000',
      },
      Info: {
        border: '#C6F042',
        hover: '#C6F042',
        background: '#C6F042',
        text: '#000000',
      },
      Releases: {
        border: '#C6F042',
        hover: '#C6F042',
        background: '#C6F042',
        text: '#000000',
      },
      Projects: {
        border: '#C2D9C7',
        hover: '#C2D9C7',
        background: '#C2D9C7',
        text: '#000000',
      },
      Pages: {
        border: '#9E9E9E',
        hover: '#9E9E9E',
        background: '#9E9E9E',
        text: '#000000',
      },
      default: {
        border: '#C6F042',
        hover: '#C6F042',
        background: 'transparent',
        text: '#000000',
      },
    },
    sections: {
      home: {
        background: '#9E9E9E',
        text: '#000000',
      },
      artists: {
        background: '#F1FB84',
        text: '#000000',
      },
      collections: {
        background: '#c5e1a5',
        text: '#000000',
      },
      blog: {
        background: '#9E9E9E',
        text: '#000000',
      },
      merch: {
        background: '#EED5F4',
        text: '#000000',
      },
      info: {
        background: '#C6F042',
        text: '#000000',
      },
      releases: {
        background: '#C6F042',
        text: '#000000',
      },
      projects: {
        background: '#C2D9C7',
        text: '#000000',
      },
      pages: {
        background: '#9E9E9E',
        text: '#000000',
      },
    } satisfies Record<SectionThemeKey, { background: string; text: string }>,
  },
}

export function colorToHex(color?: ThemeColor) {
  if (!color) return undefined
  if (typeof color === 'string') return color
  return color.hex
}

export function getSectionTheme(
  settingsTheme: SettingsTheme | null | undefined,
  section: SectionThemeKey,
) {
  const configured = settingsTheme?.sections?.[section]
  const fallback = theme.colors.sections[section]
  const backgroundColor =
    colorToHex(configured?.backgroundColor) ?? fallback.background
  const textColor = colorToHex(configured?.textColor) ?? fallback.text

  return {
    backgroundColor,
    borderColor: backgroundColor,
    hoverColor: backgroundColor,
    textColor,
    noteDrawing: configured?.noteDrawing,
  }
}

export function getSectionThemeByTitle(
  settingsTheme: SettingsTheme | null | undefined,
  title: string | undefined,
) {
  if (!title) {
    return {
      backgroundColor: theme.colors.menu.default.background,
      borderColor: theme.colors.menu.default.border,
      hoverColor: theme.colors.menu.default.hover,
      textColor: theme.colors.menu.default.text,
      noteDrawing: undefined,
    }
  }

  const section = menuTitleToSection[title]
  if (section) return getSectionTheme(settingsTheme, section)

  const fallback = theme.colors.menu.default
  return {
    backgroundColor: fallback.background,
    borderColor: fallback.border,
    hoverColor: fallback.hover,
    textColor: fallback.text,
    noteDrawing: undefined,
  }
}

export function getResolvedPageTheme({
  backgroundColor,
  textColor,
  noteDrawing,
  section,
  settingsTheme,
}: {
  backgroundColor?: ThemeColor
  textColor?: ThemeColor
  noteDrawing?: ThemeDrawing
  section: SectionThemeKey
  settingsTheme?: SettingsTheme | null
}) {
  const sectionTheme = getSectionTheme(settingsTheme, section)

  return {
    backgroundColor:
      colorToHex(backgroundColor) ?? sectionTheme.backgroundColor,
    noteDrawing: noteDrawing ?? sectionTheme.noteDrawing,
    textColor: colorToHex(textColor) ?? sectionTheme.textColor,
  }
}

export function mergeMenuTheme(
  settingsTheme: SettingsTheme | null | undefined,
  menuTheme: MenuTheme | null | undefined,
): SettingsTheme | undefined {
  if (!menuTheme?.sections) return settingsTheme ?? undefined

  const sections = { ...(settingsTheme?.sections ?? {}) }

  sectionThemeKeys.forEach((section) => {
    const menuSection = menuTheme.sections?.[section]
    if (!menuSection?.backgroundColor && !menuSection?.textColor) return

    sections[section] = {
      ...(sections[section] ?? {}),
      backgroundColor:
        menuSection.backgroundColor ?? sections[section]?.backgroundColor,
      textColor: menuSection.textColor ?? sections[section]?.textColor,
    }
  })

  return { sections }
}
