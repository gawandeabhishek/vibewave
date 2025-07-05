"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403, error: "User not authenticated" };
    }

    const email = user.emailAddresses[0].emailAddress;

    // Check if user exists by clerkId first
    const userExist = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    // If user found, return it
    if (userExist) {
      return { status: 200, user: userExist };
    }

    // Create a new user
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email,
        firstName: user.firstName || "Default First Name",
        lastName: user.lastName || "Default Last Name",
        userImage: user.imageUrl || "",
      },
    });

    return { status: 200, user: newUser };
  } catch (error) {
    console.error("Error in onAuthenticateUser:", error);
    return { status: 500, error: error || "Internal Server Error" };
  }
};

export const getUserData = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    return dbUser;
  } catch (err) {
    console.error("Failed to fetch user data", err);
    return null;
  }
};

export const updateUserData = async (formData: {
  firstName?: string;
  lastName?: string;
}) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403, error: "User not authenticated" };
    }

    // Update Clerk
    await clerkClient.users.updateUser(user.id, {
      ...(formData.firstName && { firstName: formData.firstName }),
      ...(formData.lastName && { lastName: formData.lastName }),
    });

    // Update your DB
    const updatedUser = await db.user.update({
      where: { clerkId: user.id },
      data: {
        ...(formData.firstName && { firstName: formData.firstName }),
        ...(formData.lastName && { lastName: formData.lastName }),
      },
    });

    return { status: 200, user: updatedUser };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { status: 500, error: "Internal Server Error" };
  }
};
