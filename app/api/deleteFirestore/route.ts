
import { collection, query, getDocs,getDoc, writeBatch, orderBy, limit, Firestore, Query, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { NextResponse } from 'next/server';

const deleteQueryBatch = async (
    db: Firestore,
    colQuery: Query,
    resolve: () => void
  ): Promise<void> => {
    console.log(colQuery);
    
    const snapshot = await getDocs(colQuery);
  
    const batchSize = snapshot.size;
    if (batchSize === 0) {
      resolve();
      return;
    }
  
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  
    process.nextTick(() => {
      deleteQueryBatch(db, colQuery, resolve);
    });
  };

const deleteCollection = async (
    db: Firestore,
    collectionPath: string,
    batchSize: number
  ): Promise<void> => {
      
      const colRef = collection(db, collectionPath);
      const colQuery = query(colRef, orderBy('__name__'), limit(batchSize));
      return new Promise((resolve, reject) => {
        deleteQueryBatch(db, colQuery, resolve).catch((error) => {
          console.error("Error en deleteQueryBatch:", error);
          reject(error);
        });
      });
  };
  const deleteDocumentAndCollection = async (
    db: Firestore,
    docPath: string,
    batchSize: number
  ): Promise<void> => {
    // Comprova si el document existeix    
    const docRef = doc(db, `grabatoTest/${docPath}`);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      throw new Error('El document no existeix');
    }
    // Elimina la colecció de subdocuments
    const collectionPath = `grabatoTest/${docPath}/players`;
    const colRef = collection(db, collectionPath);
    const colSnapshot = await getDocs(colRef);
    if (colSnapshot.empty) {
      throw new Error('La col·lecció no existeix o està buida');
    } 
    await deleteCollection(db, collectionPath, batchSize);
    // Eliminar el document principal
    await deleteDoc(docRef);
  };
 
export const POST = async (req: Request) => {
    console.log('hola');
    if (req.method === 'POST') {
        const body = await req.json();
        if (!body) {
          return NextResponse.error();
        }
        const { docPath,  batchSize = 10 }: { docPath: string;  batchSize: number } = body;
        try {
            await deleteDocumentAndCollection(db, docPath,  batchSize);
            return NextResponse.json({ message: 'Document i col·lecció esborrats amb èxit' });
          } catch (error) {
      
            return NextResponse.json({ message: `Error esborrant document i col·lecció: ${error}` });
        }
    } else {

        return NextResponse.json({ message: 'Mètode no permès' });

    }
};
  
