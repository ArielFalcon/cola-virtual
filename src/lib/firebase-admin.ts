import admin from "firebase-admin";

const serviceAccountString = import.meta.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountString) {
  throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida.");
}

const serviceAccount = JSON.parse(serviceAccountString);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore(); 