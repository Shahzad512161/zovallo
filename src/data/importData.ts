import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { PRODUCTS, CATEGORIES } from './dummyData';

const firebaseConfig = {
  apiKey: "AIzaSyCllsMAeEfwf5KDNHsECrUZrcD5YfDdVgE",
  authDomain: "zovallo.firebaseapp.com",
  projectId: "zovallo",
  storageBucket: "zovallo.firebasestorage.app",
  messagingSenderId: "16353576871",
  appId: "1:16353576871:web:e6a59b5e610573789f5882",
  measurementId: "G-95YTHK46EX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importData() {
  try {
    // Import categories
    console.log('Importing categories...');
    for (const categoryName of CATEGORIES) {
      const categoryRef = collection(db, 'categories');
      await addDoc(categoryRef, {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/ /g, '-'),
        createdAt: Timestamp.now()
      });
      console.log(`Imported category: ${categoryName}`);
    }

    // Import products
    console.log('Importing products...');
    for (const product of PRODUCTS) {
      const productRef = collection(db, 'products');
      await addDoc(productRef, {
        ...product,
        createdAt: Timestamp.fromDate(product.createdAt),
        reviews: product.reviews || []
      });
      console.log(`Imported product: ${product.title}`);
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

importData();