import algoliasearch from 'algoliasearch'

export function algoliaClient(searchKey: string) {
  const algoliaAppId = process.env.ALGOLIA_APP_ID
  const client = algoliasearch(algoliaAppId!, searchKey)
  return client
}
