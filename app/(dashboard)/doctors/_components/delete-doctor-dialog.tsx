"use client";

import type { Doctor } from "@/hooks/use-doctors";
import { useDeleteDoctor } from "@/hooks/use-tracker";
import { ConfirmDialog } from "@/components/ui/tracker-shared";
import { toast } from "sonner";

export default function DeleteDoctorDialog({
  doctor,
  onClose,
  onDeleted,
}: {
  doctor: Doctor;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const mutation = useDeleteDoctor();
  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={`Delete ${doctor.name}?`}
      description={`This permanently deletes this doctor.${doctor.patientCount > 0 ? ` This will also delete ${doctor.patientCount} patients.` : " This action cannot be undone."}`}
      pending={mutation.isPending}
      error={mutation.error}
      onConfirm={() =>
        mutation.mutate(doctor.id, {
          onSuccess: () => {
            toast.success("Doctor deleted successfully");
            onClose();
            onDeleted?.();
          },
        })
      }
    />
  );
}
