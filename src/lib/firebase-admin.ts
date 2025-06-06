import admin from "firebase-admin";

const serviceAccount = JSON.parse(import.meta.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const db = admin.firestore(); 