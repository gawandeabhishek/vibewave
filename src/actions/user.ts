"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403, error: 'User not authenticated' };
    }

    const userExist = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }

    // Create a new user if not found
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || 'Default First Name', // Fallback if missing
        lastName: user.lastName || 'Default Last Name',   // Fallback if missing
        userImage: user.imageUrl || '',                    // Fallback if missing
      },
    });

    if (newUser) {
      return { status: 200, user: newUser };
    }

    return { status: 400, error: 'Failed to create user' };
  } catch (error) {
    console.error('Error in onAuthenticateUser:', error); // Log the actual error
    return { status: 500, error: error || 'Internal Server Error' };
  }
};
