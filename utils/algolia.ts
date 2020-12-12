import algoliasearch from 'algoliasearch'

export function algoliaClient(searchKey: string) {
  const algoliaAppId = process.env.algoliaAppId
  const client = algoliasearch(algoliaAppId!, searchKey)
  return client
}
