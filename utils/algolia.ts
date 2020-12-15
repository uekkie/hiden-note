import algoliasearch from 'algoliasearch'

export function algoliaClient() {
  const algoliaAppId = process.env.ALGOLIA_APP_ID
  const algoliaSearchKey = process.env.ALGOLIA_SEARCH_KEY
  return algoliasearch(algoliaAppId!, algoliaSearchKey!)
}
