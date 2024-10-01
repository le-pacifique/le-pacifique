/**
 * This plugin contains all the logic for setting up the singletons
 */

import { type DocumentDefinition } from 'sanity'
import { type StructureResolver } from 'sanity/structure'

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
  typeDefArray: DocumentDefinition[],
): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Desktool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name),
        )
    })

    // The default root list items (except custom ones)
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) =>
        !typeDefArray.find((singleton) => singleton.name === listItem.getId()),
    )

    return S.list()
      .title('Content')
      .items([
        ...singletonItems,
        S.divider(),
        S.listItem()
          .title('Articles')
          .schemaType('article')
          .child(S.documentTypeList('article').title('Articles')),
        S.listItem()
          .title('Artists')
          .schemaType('artist')
          .child(S.documentTypeList('artist').title('Artists')),
        S.listItem()
          .title('Collections')
          .schemaType('collection')
          .child(S.documentTypeList('collection').title('Collections')),
        S.listItem()
          .title('Releases')
          .schemaType('release')
          .child(S.documentTypeList('release').title('Releases')),
        S.listItem()
          .title('Merch')
          .child(
            S.list()
              .title('Merch Types')
              .items([
                S.listItem()
                  .title('Vinyl')
                  .child(
                    S.documentTypeList('merch')
                      .title('Vinyl')
                      .filter('_type == "merch" && type == "vinyl"'),
                  ),
                S.listItem()
                  .title('Tapes')
                  .child(
                    S.documentTypeList('merch')
                      .title('Tapes')
                      .filter('_type == "merch" && type == "tapes"'),
                  ),
                S.listItem()
                  .title('Clothes')
                  .child(
                    S.documentTypeList('merch')
                      .title('Clothes')
                      .filter('_type == "merch" && type == "clothes"'),
                  ),
                S.listItem()
                  .title('Bibelots')
                  .child(
                    S.documentTypeList('merch')
                      .title('Bibelots')
                      .filter('_type == "merch" && type == "bibelots"'),
                  ),
              ]),
          ),
        S.divider(),
        S.listItem()
          .title('Pages')
          .schemaType('page')
          .child(S.documentTypeList('page').title('Pages')),
      ])
  }
}
