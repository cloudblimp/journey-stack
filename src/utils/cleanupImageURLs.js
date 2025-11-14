import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * This utility fixes trips with broken localhost image URLs
 * Run this once to clean up old emulator URLs from your database
 */

export async function cleanupBrokenImageURLs() {
  try {
    console.log('Starting cleanup of broken image URLs...');
    const tripsRef = collection(db, 'trips');
    const snapshot = await getDocs(tripsRef);
    
    let fixed = 0;
    let skipped = 0;

    for (const tripDoc of snapshot.docs) {
      const trip = tripDoc.data();
      
      // Check if coverImage points to localhost (broken emulator URL)
      if (trip.coverImage && trip.coverImage.includes('localhost')) {
        console.log(`Fixing trip: ${trip.title}`);
        
        // Remove broken image URL
        await updateDoc(doc(db, 'trips', tripDoc.id), {
          coverImage: null
        });
        
        fixed++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Cleanup complete! Fixed: ${fixed}, Skipped: ${skipped}`);
    alert(`Cleanup complete!\nFixed: ${fixed} trips\nSkipped: ${skipped} trips`);
    
    return { fixed, skipped };
  } catch (error) {
    console.error('Error during cleanup:', error);
    alert(`Error: ${error.message}`);
  }
}
