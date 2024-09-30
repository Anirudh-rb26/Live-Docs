import AddDocumentButton from "@/components/add-document-button";
import { DeleteModal } from "@/components/delete-modal";
import Header from "@/components/header";
import { Notifications } from "@/components/notifications";
import { getAllDocuments } from "@/lib/actions/room-actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const allDocuments = await getAllDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="items-center flex gap-2 lg:gap-4">
          <Notifications></Notifications>
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
        </div>
      </Header>

      {allDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All Documents</h3>
            <AddDocumentButton
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            ></AddDocumentButton>
          </div>
          <ul className="document-ul">
            {allDocuments.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className="document-list-item">
                <Link
                  href={`/documents/${id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image
                      src="/assets/icons/doc.svg"
                      alt="Document Icon"
                      width={40}
                      height={40}
                    ></Image>
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">
                      Created {dateConverter(createdAt)}
                    </p>
                  </div>
                </Link>
                <DeleteModal roomId={id}></DeleteModal>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          ></Image>
          <AddDocumentButton
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          ></AddDocumentButton>
        </div>
      )}
    </main>
  );
};

export default HomePage;
