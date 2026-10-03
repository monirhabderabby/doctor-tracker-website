"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDoctorOptions, useSavePatient } from "@/hooks/use-tracker";
import { patientSchema, type PatientValues } from "@/schemas/patient.schema";
import type { Patient } from "@/lib/tracker-types";
import { conditions } from "@/lib/constants";
import { applyFormErrors } from "@/lib/form-errors";
import { getApiErrorMessage } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fields = [
  "name",
  "age",
  "gender",
  "phone",
  "condition",
  "doctorId",
] as const;
const selectStyle = "h-10! w-fit max-w-full bg-card";

export default function PatientFormDialog({
  patient,
  doctorId,
  onClose,
}: {
  patient?: Patient;
  doctorId?: string;
  onClose: () => void;
}) {
  const mutation = useSavePatient();
  const doctors = useDoctorOptions(!doctorId);
  const form = useForm<PatientValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name ?? "",
      age: patient?.age ?? 0,
      gender: patient?.gender ?? "MALE",
      phone: patient?.phone ?? "",
      condition: patient?.condition ?? "",
      doctorId: doctorId ?? patient?.doctorId ?? "",
    },
  });
  const pending = mutation.isPending;
  function onSubmit(values: PatientValues) {
    mutation.mutate(
      { id: patient?.id, doctorId, values },
      {
        onSuccess: () => {
          toast.success(
            patient
              ? "Patient updated successfully"
              : "Patient added successfully",
          );
          onClose();
        },
        onError: (error) => {
          applyFormErrors(error, form.setError, fields);
          toast.error(getApiErrorMessage(error));
        },
      },
    );
  }
  const doctorOptions = doctors.data?.data ?? [];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!pending}
        className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-xl"
        onEscapeKeyDown={(event) => {
          if (pending) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{patient ? "Edit patient" : "Add patient"}</DialogTitle>
          <DialogDescription>
            {patient
              ? "Update care details or assign a different doctor."
              : "Introduce a new patient to your care network."}{" "}
            All fields are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
            aria-busy={pending}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="name"
                      placeholder="Full name"
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={Number.isNaN(field.value) ? "" : field.value}
                        type="number"
                        min={0}
                        max={120}
                        step={1}
                        disabled={pending}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ""
                              ? NaN
                              : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={pending}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={selectStyle}
                          ref={field.ref}
                          onBlur={field.onBlur}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        <SelectItem value="MALE" className="py-2.5">
                          Male
                        </SelectItem>
                        <SelectItem value="FEMALE" className="py-2.5">
                          Female
                        </SelectItem>
                        <SelectItem value="OTHER" className="py-2.5">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+8801712345678"
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pending}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={selectStyle}
                        ref={field.ref}
                        onBlur={field.onBlur}
                      >
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {Array.from(
                        new Set([
                          ...conditions,
                          ...(patient?.condition ? [patient.condition] : []),
                        ]),
                      ).map((value) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="py-2.5"
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!doctorId && (
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned doctor</FormLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={pending || doctors.isPending || doctors.isError}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={selectStyle}
                          ref={field.ref}
                          onBlur={field.onBlur}
                        >
                          <SelectValue
                            placeholder={
                              doctors.isPending
                                ? "Loading doctors…"
                                : "Select doctor"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        {patient &&
                          !doctorOptions.some(
                            (doctor) => doctor.id === patient.doctorId,
                          ) && (
                            <SelectItem
                              value={patient.doctorId}
                              className="py-2.5"
                            >
                              {patient.doctor?.name ?? "Current doctor"}
                            </SelectItem>
                          )}
                        {doctorOptions.map((doctor) => (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.id}
                            className="py-2.5"
                          >
                            {doctor.name} · {doctor.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {doctors.isError && (
                      <div role="alert" className="text-sm text-destructive">
                        {getApiErrorMessage(doctors.error)}{" "}
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => void doctors.refetch()}
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                    {doctors.data?.meta.total === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add a doctor before adding patients.
                      </p>
                    )}
                    {doctors.data && doctors.data.meta.total > 100 && (
                      <p className="text-xs text-muted-foreground">
                        Showing the first 100 doctors. You can add a patient
                        from any doctor’s profile.
                      </p>
                    )}
                  </FormItem>
                )}
              />
            )}
            {mutation.isError && (
              <p role="alert" className="text-sm text-destructive">
                {getApiErrorMessage(mutation.error)}
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  pending ||
                  (!doctorId &&
                    (doctors.isPending ||
                      doctors.isError ||
                      doctors.data?.meta.total === 0))
                }
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                {pending ? "Saving…" : patient ? "Save changes" : "Add patient"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
