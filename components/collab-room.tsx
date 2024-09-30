"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Loader from "./loader";
import Header from "./header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveCollaborators from "./active-collaborators";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/lib/actions/room-actions";
import ShareModal from "./share-modal";

const CollabRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docTitle, setDocTitle] = useState(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);

      try {
        if (docTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument({
            roomId,
            title: docTitle,
          });

          if (updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateDocument({ roomId, title: docTitle });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, docTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <Input
                  type="text"
                  value={docTitle}
                  ref={inputRef}
                  placeholder="Enter Title"
                  onChange={(e) => setDocTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  className="document-title-input"
                ></Input>
              ) : (
                <>
                  <p className="document-title">{docTitle}</p>
                </>
              )}
              {/* If CurrentUser is an Editor */}
              {currentUserType === "editor" && !editing && (
                <Image
                  src={"/assets/icons/edit.svg"}
                  alt="edit button"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                ></Image>
              )}
              {/* If CurrentUser is not an Editor */}
              {currentUserType !== "editor" && !editing && (
                <p className="view-only-tag">view only</p>
              )}
              {/* LoadingState */}
              {loading && <p className="text-sm text-gray-400">saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators></ActiveCollaborators>
              <ShareModal
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              ></ShareModal>
              <SignedOut>
                <SignInButton></SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton></UserButton>
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollabRoom;
