import { DiscussionForum } from "@/components/community/DiscussionForum";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="w-full">
          <DiscussionForum showAllTopics={true} />
        </div>
      </main>
    </div>
  );
};

export default Community;