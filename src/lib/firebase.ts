import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Ne e inicializojmë firebase vetëm nëse apiKey ekziston për të mos "krashtuar" (crash) aplikacionin
const isConfigured = firebaseConfig && firebaseConfig.apiKey !== "VENDOS_ÇELËSIN_KËTU" && firebaseConfig.apiKey !== "";

export const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const auth = isConfigured ? getAuth(app!) : null;
export const db = isConfigured ? getFirestore(app!, firebaseConfig.firestoreDatabaseId || '(default)') : null;
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Test connection silently globally
if (db) {
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, '_system_', 'connection_test'));
    } catch (error: any) {
      if(error.message?.includes('the client is offline')) {
        console.warn("Firestore is currently offline or blocking connection. Operating in fallback mode.");
      }
    }
  };
  // suppress test errors completely to not bother tests
  testConnection().catch(() => {});
}

export { isConfigured };
