import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const onNoteCreated = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
  .onCreate(require('./onCreateNote'))

export const onUpdateNote = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
  .onUpdate(require('./onUpdateNote'))

export const onDeleteNote = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
  .onDelete(require('./onDeleteNote'))
