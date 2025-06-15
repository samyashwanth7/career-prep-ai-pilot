
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}
const ApiKeyModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const { toast } = useToast();
  const [key, setKey] = useState(localStorage.getItem("openai_api_key") || "");

  function handleSave() {
    if (!/^sk-/.test(key.trim())) {
      toast({ title: "Invalid API Key", description: "API key usually starts with sk-..." });
      return;
    }
    localStorage.setItem("openai_api_key", key.trim());
    toast({ title: "OpenAI API Key set!", description: "Your key is saved securely in your browser." });
    onSave?.();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your OpenAI API Key</DialogTitle>
          <div className="mt-2 text-sm text-muted-foreground">
            We NEVER send your key to any backend, only directly to OpenAI from your browser to keep your data private. 
            <a target="_blank" rel="noopener noreferrer" href="https://platform.openai.com/api-keys" className="ml-2 underline text-blue-500">Get your key</a>
          </div>
        </DialogHeader>
        <Input 
          value={key} 
          onChange={e => setKey(e.target.value)} 
          placeholder="sk-..." 
          className="mt-4" 
          type="password"
        />
        <DialogFooter className="justify-between mt-6">
          <Button type="button" onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
