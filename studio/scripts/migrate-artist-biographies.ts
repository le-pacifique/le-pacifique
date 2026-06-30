import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-06-21' })

function textToBlocks(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _key: `bio_${index}`,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: `bio_${index}_span`,
          _type: 'span',
          marks: [],
          text: paragraph,
        },
      ],
    }))
}

async function main() {
  const artists = await client.fetch<
    Array<{ _id: string; biography?: unknown }>
  >(`*[_type == "artist" && defined(biography)]{_id, biography}`)

  const transaction = client.transaction()
  let migrated = 0

  artists.forEach((artist) => {
    if (typeof artist.biography !== 'string') return

    transaction.patch(artist._id, (patch) =>
      patch.set({ biography: textToBlocks(artist.biography) }),
    )
    migrated += 1
  })

  if (migrated === 0) {
    console.log('No artist biographies needed migration.')
    return
  }

  await transaction.commit()
  console.log(`Migrated ${migrated} artist biographies.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
