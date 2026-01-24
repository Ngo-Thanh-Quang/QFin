import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

function ensureFirebaseInitialized(): void {
  if (admin.apps.length) {
    return;
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const cred = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(cred),
      });
      console.log('[Firebase] initialized using FIREBASE_SERVICE_ACCOUNT_JSON env');
    } else {
      // fallback: try default credentials (GCP metadata) - will work on GCP if set
      admin.initializeApp();
      console.log('[Firebase] initialized with default credentials (no service account file found)');
    }
  } catch (err) {
    console.error('[Firebase] initialization error:', err);
    throw err;
  }
}

export const FirebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    ensureFirebaseInitialized();
    return admin;
  },
};

export const FirebaseAuthProvider: Provider = {
  provide: 'FIREBASE_AUTH',
  useFactory: () => {
    ensureFirebaseInitialized();
    return admin.auth();
  },
};

export const FirebaseDbProvider: Provider = {
  provide: 'FIREBASE_DB',
  useFactory: () => {
    ensureFirebaseInitialized();
    return admin.firestore();
  },
};
