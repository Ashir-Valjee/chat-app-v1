import { firestore } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id"); // Assuming you pass user id as a query parameter

    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
