/* ---- Firebase: inloggen en online tuin (alleen in de webversie; build.js voegt dit bestand toe) ---- */
/* Deze config is niet geheim: hij staat altijd in de pagina. Wie wat mag, regelt firestore.rules. */
const FB_CONFIG={
  apiKey:'AIzaSyAx-XhflGNHaYw_U7detLC-VAY1dPwwlH8',
  authDomain:'sowly-f5be6.firebaseapp.com',
  projectId:'sowly-f5be6',
  storageBucket:'sowly-f5be6.firebasestorage.app',
  messagingSenderId:'1039020935298',
  appId:'1:1039020935298:web:e06c331aa2f2a13b72cc9b'
};
const FB_V='12.19.0';
async function fbLoad(){
  const u=m=>`https://www.gstatic.com/firebasejs/${FB_V}/firebase-${m}.js`;
  const [A,Au,F]=await Promise.all([import(u('app')),import(u('auth')),import(u('firestore'))]);
  const app=A.initializeApp(FB_CONFIG),auth=Au.getAuth(app);
  auth.languageCode='nl';
  return {Au,F,auth,db:F.getFirestore(app)};
}
