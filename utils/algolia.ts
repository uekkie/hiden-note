import algoliasearch from 'algoliasearch'

export function algoliaClient() {
  console.log(process.env.ALGOLIA_APP_ID, ' is enabels.')
  const algoliaAppId = process.env.ALGOLIA_APP_ID
  // const algoliaAdminKey = process.env.ALGOLIA_ADMIN_KEY
  const algoliaSearchKey = process.env.ALGOLIA_SEARCH_KEY
  return algoliasearch(algoliaAppId!, algoliaSearchKey!)
}
