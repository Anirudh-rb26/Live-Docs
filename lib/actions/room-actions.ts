"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { error } from "console";
import { redirect } from "next/navigation";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email: email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error("You do not have Access to this document");
    }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export const updateDocument = async ({
  roomId,
  title,
}: {
  roomId: string;
  title: string;
}) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: { title },
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export const getAllDocuments = async (email: string) => {
  try {
    const allRooms = await liveblocks.getRooms({ userId: email });
    return parseStringify(allRooms);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, { usersAccesses });

    if (room) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been invited by ${updatedBy.name} to ${userType} document.`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId: roomId,
      });
    }

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: { [email]: null },
    });

    revalidatePath(`/document/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
