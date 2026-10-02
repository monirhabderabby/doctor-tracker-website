"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Modal } from "../modal";

interface Props {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
}

const AlertModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
  message,
  title,
}: Props) => {
  return (
    <Modal
      title={title ?? "Confirm Action"}
      description={
        message ??
        "Are you sure you want to proceed? This action cannot be undone."
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose}
          className="h-10 rounded-md px-4 py-2 text-primary hover:text-primary/80 focus:ring-0 outline-0"
        >
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm} className="h-10 rounded-md px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90">
          Continue {loading && <Loader2 className="animate-spin" />}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
