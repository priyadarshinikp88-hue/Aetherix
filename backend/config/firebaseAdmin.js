import {
  getApps,
  initializeApp,
  cert,
} from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";

const privateKey =
  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      })
    : getApps()[0];

const adminAuth = getAuth(app);

export { app, adminAuth };
export default app;