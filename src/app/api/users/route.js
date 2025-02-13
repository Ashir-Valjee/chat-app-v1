import { firestore } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const usersCollectionRef = collection(firestore, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(usersList, { status: 200 });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
