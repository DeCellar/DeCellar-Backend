import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = process.env;

export default function initializeFirebaseServer(): {
  db: Firestore;
  auth: Auth;
} {
  const clientEmail = FIREBASE_CLIENT_EMAIL as string;
  const privateKey = (FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n');
  const projectId = FIREBASE_PROJECT_ID as string;

  if (admin.apps.length === 0) {
    initializeApp({
      credential: cert({
        clientEmail,
        privateKey,
        projectId,
      }),
    });
  }

  const db = getFirestore();
  const auth = getAuth();

  return {
    db,
    auth,
  };
}
