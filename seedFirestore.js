
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");
const countriesData = require("./countries.json");

// Replace with YOUR Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  for (let country of countriesData) {
    try {
      await setDoc(doc(collection(db, "countries"), country.country.toLowerCase()), country);
      console.log(`✅ Added: ${country.country}`);
    } catch (err) {
      console.error(`❌ Failed: ${country.country}`, err);
    }
  }
})();
