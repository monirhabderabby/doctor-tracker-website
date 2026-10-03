"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Doctor, useCreateDoctor, useUpdateDoctor } from "@/hooks/use-doctors";
import { getApiErrorMessage } from "@/lib/api";
import { createDoctorSchema, CreateDoctorValues } from "@/schemas/doctors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  trigger?: ReactNode;
  initialData?: Doctor;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const fields = [
  {
    name: "name",
    label: "Doctor name",
    placeholder: "Enter doctor name",
    type: "text",
    autoComplete: "name",
  },
  {
    name: "specialization",
    label: "Specialization",
    placeholder: "e.g. Cardiology",
    type: "text",
    autoComplete: "off",
  },
  {
    name: "hospital",
    label: "Hospital",
    placeholder: "Enter hospital name",
    type: "text",
    autoComplete: "organization",
  },
  {
    name: "phone",
    label: "Phone",
    placeholder: "e.g. +8801712345678",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "doctor@example.com",
    type: "email",
    autoComplete: "email",
  },
] as const;

export default function AddDoctorModal({
  trigger,
  initialData,
  open: controlledOpen,
  onOpenChange,
  onClose,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const mutation = initialData ? updateMutation : createMutation;
  const resetMutation = mutation.reset;
  function setOpen(value: boolean) {
    setInternalOpen(value);
    onOpenChange?.(value);
  }
  const pending = mutation.isPending;
  const form = useForm<CreateDoctorValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (open) {
      resetMutation();
      form.reset({
        name: initialData?.name ?? "",
        specialization: initialData?.specialization ?? "",
        hospital: initialData?.hospital ?? "",
        phone: initialData?.phone ?? "",
        email: initialData?.email ?? "",
      });
    }
  }, [open, initialData, form, resetMutation]);

  function handleOpenChange(nextOpen: boolean) {
    if (pending) return;
    form.reset();
    mutation.reset();
    setOpen(nextOpen);
    if (!nextOpen) onClose?.();
  }

  function onSubmit(values: CreateDoctorValues) {
    if (pending) return;
    const options = {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success(
          initialData ? "Doctor updated successfully" : "Doctor created successfully",
        );
        onClose?.();
      },
    };
    if (initialData) {
      updateMutation.mutate({ id: initialData.id, values }, options);
    } else {
      createMutation.mutate(values, options);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg"
        onEscapeKeyDown={(event) => {
          if (pending) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Doctor" : "Create Doctor"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the doctor's contact details."
              : "Add a doctor and their contact details."} All fields are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
            aria-busy={pending}
          >
            {fields.map(({ name, label, ...inputProps }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        {...inputProps}
                        {...field}
                        disabled={pending}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {mutation.isError && (
              <p role="alert" className="text-sm text-destructive">
                {getApiErrorMessage(mutation.error)}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                disabled={pending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending} className="h-9">
                {pending && (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                )}
                {pending
                  ? (initialData ? "Saving..." : "Creating...")
                  : (initialData ? "Save Changes" : "Create Doctor")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
