import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import ThreadCard from "@/components/cards/ThreadCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.action";

export const revalidate = 0;

/**
 * Renders a page with a thread and comments.
 *
 * @param {Object} params - The parameters for the page.
 * @param {string} params.id - The ID of the thread.
 *
 * @returns {JSX.Element|null} - The page component.
 */
async function page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element | null> {
  // Check if the ID is provided
  if (!params.id) return null;

  // Fetch the current user
  const user = await currentUser();
  if (!user) return null;

  // Fetch user info
  const userInfo = await fetchUser(user.id);
  // Redirect to onboarding if the user is not onboarded
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch the thread by ID
  const thread = await fetchThreadById(params.id);

  // Render the thread card and comments
  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
