import functions = require('firebase-functions')

import admin = require('firebase-admin')
admin.initializeApp()

export const onCreateNote = functions
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
