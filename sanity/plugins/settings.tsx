/**
 * This plugin contains all the logic for setting up the singletons
 */

import { type DocumentDefinition } from 'sanity'
import { type StructureResolver } from 'sanity/structure'
import {
  LuAlbum,
  LuBadgeInfo,
  LuCassetteTape,
  LuDisc3,
  LuFileText,
  LuGem,
  LuHouse,
  LuImage,
  LuMenu,
  LuMusic,
  LuNewspaper,
  LuPalette,
  LuSettings,
  LuShirt,
  LuShoppingBag,
  LuUsers,
} from 'react-icons/lu'

export const singletonPlugin = (types: string[]) => {
  return {
    name: 'singletonPlugin',
    document: {
      // Hide 'Singletons (such as Home)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (prev, { creationContext }) => {
        if (creationContext.type === 'global') {
          return prev.filter(
            (templateItem) => !types.includes(templateItem.templateId),
          )
        }

        return prev
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== 'duplicate')
        }

        return prev
      },
    },
  }
}

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// like how "Home" is handled.
export const pageStructure = (
  _typeDefArray: DocumentDefinition[],
): StructureResolver => {
  return (S) => {
    return S.list()
      .title('Content')
      .items([
        S.listItem()
          .title('Home')
          .icon(LuHouse)
          .schemaType('home')
          .child(S.editor().id('home').schemaType('home').documentId('home')),
        S.divider(),
        S.listItem()
          .title('Artists')
          .icon(LuUsers)
          .schemaType('artist')
          .child(S.documentTypeList('artist').title('Artists')),
        S.listItem()
          .title('Collections')
          .icon(LuDisc3)
          .schemaType('collection')
          .child(S.documentTypeList('collection').title('Collections')),
        S.listItem()
          .title('Releases')
          .icon(LuMusic)
          .schemaType('release')
          .child(S.documentTypeList('release').title('Releases')),
        S.listItem()
          .title('Blog')
          .icon(LuNewspaper)
          .child(
            S.list()
              .title('Blog')
              .items([
                S.listItem()
                  .title('Blog')
                  .icon(LuSettings)
                  .schemaType('blog')
                  .child(
                    S.editor().id('blog').schemaType('blog').documentId('blog'),
                  ),
                S.divider(),
                S.listItem()
                  .title('Articles')
                  .icon(LuFileText)
                  .schemaType('article')
                  .child(S.documentTypeList('article').title('Articles')),
              ]),
          ),
        S.listItem()
          .title('Merch')
          .icon(LuShoppingBag)
          .child(
            S.list()
              .title('Merch Types')
              .items([
                S.listItem()
                  .title('Vinyl')
                  .icon(LuAlbum)
                  .child(
                    S.documentTypeList('merch')
                      .title('Vinyl')
                      .filter('_type == "merch" && type == "vinyl"'),
                  ),
                S.listItem()
                  .title('Tapes')
                  .icon(LuCassetteTape)
                  .child(
                    S.documentTypeList('merch')
                      .title('Tapes')
                      .filter('_type == "merch" && type == "tapes"'),
                  ),
                S.listItem()
                  .title('Clothes')
                  .icon(LuShirt)
                  .child(
                    S.documentTypeList('merch')
                      .title('Clothes')
                      .filter('_type == "merch" && type == "clothes"'),
                  ),
                S.listItem()
                  .title('Bibelots')
                  .icon(LuGem)
                  .child(
                    S.documentTypeList('merch')
                      .title('Bibelots')
                      .filter('_type == "merch" && type == "bibelots"'),
                  ),
              ]),
          ),
        S.listItem()
          .title('Info')
          .icon(LuBadgeInfo)
          .schemaType('info')
          .child(S.editor().id('info').schemaType('info').documentId('info')),
        S.divider(),
        S.listItem()
          .title('Media')
          .icon(LuPalette)
          .child(
            S.list()
              .title('Media Types')
              .items([
                S.listItem()
                  .title('Drawings')
                  .icon(LuPalette)
                  .child(S.documentTypeList('drawingsBank').title('Drawings')),
                S.listItem()
                  .title('Images')
                  .icon(LuImage)
                  .child(S.documentTypeList('imagesBank').title('Images')),
              ]),
          ),
        S.divider(),
        S.listItem()
          .title('Menu')
          .icon(LuMenu)
          .schemaType('menu')
          .child(S.editor().id('menu').schemaType('menu').documentId('menu')),
        S.listItem()
          .title('Settings')
          .icon(LuSettings)
          .schemaType('settings')
          .child(
            S.editor()
              .id('settings')
              .schemaType('settings')
              .documentId('settings'),
          ),
      ])
  }
}
