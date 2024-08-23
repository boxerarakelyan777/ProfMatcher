import { NextResponse } from 'next/server';

import { db } from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';



export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // Add additional server-side validation here

    const docRef = await addDoc(collection(db, "waitlist"), {
      name,
      email,
      timestamp: new Date()
    });

    return NextResponse.json({ message: "Successfully added to waitlist", id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json({ message: "An error occurred while adding to waitlist" }, { status: 500 });
  }
}