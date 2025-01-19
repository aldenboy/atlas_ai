import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DiscussionFormFields } from "./form/DiscussionFormFields";
import { DiscussionFormActions } from "./form/DiscussionFormActions";

interface NewDiscussionFormProps {
  onClose: () => void;
}

export const NewDiscussionForm = ({ onClose }: NewDiscussionFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("discussions")
        .insert([{ title, content, category }]);

      if (error) throw error;

      toast({
        title: "Discussion created",
        description: "Your discussion has been posted successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form onSubmit={handleSubmit}>
        <DiscussionFormFields
          title={title}
          content={content}
          category={category}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCategoryChange={setCategory}
        />
        <DiscussionFormActions
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </Card>
  );
};