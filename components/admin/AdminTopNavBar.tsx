import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface AdminTopNavBarProps {
  title: string;
  description?: string;
  onBack: () => void;
  onSave: () => void;
  onSaveDraft?: () => void;
  isSaving: boolean;
  saveLabel?: string;
}

export default function AdminTopNavBar({
  title,
  description,
  onBack,
  onSave,
  onSaveDraft,
  isSaving,
  saveLabel = "Save",
}: AdminTopNavBarProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="flex gap-3">
        {onSaveDraft && (
          <Button variant="outline" onClick={onSaveDraft}>
            Save Draft
          </Button>
        )}
        <Button onClick={onSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Saving..." : saveLabel}
        </Button>
      </div>
    </div>
  );
}
