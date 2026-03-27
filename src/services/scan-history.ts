import { 
  Firestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  orderBy,
  Timestamp
} from 'firebase/firestore';

export interface ScanRecord {
  repoOwner: string;
  repoName: string;
  branch: string;
  scanMode: 'commit' | 'code' | 'full';
  threatsDetected: number;
  nodesAnalyzed: number;
  timestamp: any;
}

export interface UserStats {
  reposScanned: number;
  threatsDetected: number;
  activeNodes: number;
}

export async function saveScanRecord(
  firestore: Firestore, 
  userId: string, 
  record: Omit<ScanRecord, 'timestamp'>
) {
  try {
    const colRef = collection(firestore, 'users', userId, 'scans');
    await addDoc(colRef, {
      ...record,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving scan record:", error);
  }
}

export async function getUserScanStats(
  firestore: Firestore, 
  userId: string
): Promise<UserStats> {
  try {
    const colRef = collection(firestore, 'users', userId, 'scans');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    let totalThreats = 0;
    let totalScans = 0;
    const uniqueRepos = new Set<string>();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ScanRecord;
      totalThreats += data.threatsDetected || 0;
      totalScans += 1;
      uniqueRepos.add(`${data.repoOwner}/${data.repoName}`);
    });
    
    return {
      reposScanned: totalScans, // Count every scan session
      threatsDetected: totalThreats,
      activeNodes: uniqueRepos.size // Only count unique repositories as "Active Nodes"
    };
  } catch (error) {
    console.error("Error fetching user scan stats:", error);
    return {
      reposScanned: 0,
      threatsDetected: 0,
      activeNodes: 0
    };
  }
}
