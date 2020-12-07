import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { algoliaClient } from './algolia/client'

admin.initializeApp()

export const onNoteCreated = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
  .onCreate((snap, context) => {
    const note = snap.data()
    note.objectID = context.params.noteId
    const index = algoliaClient().initIndex('notes')
    return index.saveObject(note)
  })
