import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DiscussionFormFieldsProps {
  title: string;
  content: string;
  category: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const DiscussionFormFields = ({
  title,
  content,
  category,
  onTitleChange,
  onContentChange,
  onCategoryChange,
}: DiscussionFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Input
          placeholder="Discussion title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[150px]"
        />
      </div>
      <div>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="News">News</SelectItem>
            <SelectItem value="Market">Market</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};