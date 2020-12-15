import * as functions from 'firebase-functions'
import algoliasearch from 'algoliasearch'

export const algoliaClient = () => {
  const algoliaId = functions.config().algolia.app_id
  const algoliaAdminKey = functions.config().algolia.api_key
  return algoliasearch(algoliaId, algoliaAdminKey)
}
