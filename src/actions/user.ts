"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const userExist = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        myPlaylists: {
          where: {
            user: {
              clerkId: user.id,
            },
          },
        },
        likedSongs: {
          where: {
            user: {
              clerkId: user.id,
            },
          },
        },
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName!,
        lastName: user.lastName!,
        userImage: user.imageUrl,
      },
    });
 
    if (newUser) return { status: 200, user: newUser };
    return { status: 400 };
  } catch (error) {
    return { status: 500, error };
  }
};
