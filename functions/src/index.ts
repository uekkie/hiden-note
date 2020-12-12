import functions = require('firebase-functions')

import admin =  require('firebase-admin')
admin.initializeApp()

export const onCreateNote = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
  .onCreate(require('./onCreateNote'))
