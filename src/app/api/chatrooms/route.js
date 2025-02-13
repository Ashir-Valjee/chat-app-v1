import { firestore } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id"); // Assuming you pass user id as query parameter

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const chatroomsCollectionRef = collection(firestore, "chatrooms");
    const q = query(
      chatroomsCollectionRef,
      where("users", "array-contains", userId)
    );
    const chatroomsSnapshot = await getDocs(q);
    const chatroomsList = chatroomsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(chatroomsList, { status: 200 });
  } catch (error) {
    console.error("Error fetching user chatrooms:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
