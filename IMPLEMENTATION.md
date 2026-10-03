# Doctor Tracker handover

## Existing features preserved

Phase 0 found working login, cookie auth, session recovery, route protection, logout, query/theme providers, doctor list/search/pagination, and doctor create/edit mutations. These were reused and extended. The login API function and doctor API functions were moved out of components/hooks without changing their request or response behavior. The existing login schema already lived under `schemas/` and stayed there.

The backend in `../backend` was inspected read-only to confirm routes, MongoDB IDs, validation, pagination, cascaded deletion, and Asia/Dhaka timeline buckets. No backend files were modified.

Baseline lint passed. Baseline typecheck failed because the existing uncommitted `command.tsx` expected a `showCloseButton` prop missing from the dialog; the dialog now supports it. Other pre-existing uncommitted UI components and package changes were preserved.

## Phase-wise file list

Some foundation files were extended again in later phases.

### Phase 1: Foundation

- `components/Logo.tsx`, `app/icon.svg`: matching stethoscope logo and favicon.
- `schemas/doctor.schema.ts`, `schemas/doctors/index.ts`: existing doctor validation moved to the requested file; original imports remain compatible through a re-export.
- `schemas/patient.schema.ts`, `schemas/filters.schema.ts`: patient and URL query validation.
- `lib/constants.ts`, `lib/tracker-types.ts`: specialization/condition lists and API response types.
- `lib/tracker-api.ts`, `lib/query-keys.ts`, `lib/form-errors.ts`: API functions, query keys, and 400/409 field error mapping.
- `hooks/use-tracker.ts`, `hooks/use-url-filters.ts`, `hooks/use-doctors.ts`: missing queries/mutations, URL filters, and extensions to existing doctor hooks.
- `components/ui/tracker-shared.tsx`: page headers, search, date range, pagination, confirmation, initials, badges, skeletons, empty/error states.
- `components/ui/responsive-records.tsx`, `components/ui/stat-card.tsx`: responsive records and stat cards. No reusable stat card existed in the starting project.
- `components/ui/dialog.tsx`: missing close-button compatibility.
- `app/globals.css`, `components/auth/portal-session.tsx`, `app/(dashboard)/_components/sidebar.tsx`, `app/(dashboard)/_components/top-bar.tsx`, `providers/app-provider.tsx`: teal theme, spacing, logo, header, progress/toast styling.
- Root title template in `app/layout.tsx` was already correct and was reused.

### Phase 2: Doctors

- `app/(dashboard)/doctors/page.tsx`: page title, header, add button, Suspense boundary.
- `app/(dashboard)/doctors/_components/doctors-table.tsx`: existing TanStack Table retained; URL filters, page sizes, mobile cards, skeletons and prefetch added.
- `app/(dashboard)/doctors/_components/get-doctors-client.tsx`: existing query entry points retained and connected to shared API/query options.
- `app/(dashboard)/doctors/_components/column.tsx`: avatars, combined name/email, badges, joined date and column sizing.
- `app/(dashboard)/doctors/_components/add-doctor-modal.tsx`: existing create/edit flow retained; Select, lazy form mounting and field errors added.
- `app/(dashboard)/doctors/_components/doctor-row-action.tsx`, `app/(dashboard)/doctors/_components/delete-doctor-dialog.tsx`: view/edit/delete and cascade warning.
- `components/ui/data-table.tsx`: fixed column sizing and optional border treatment.

### Phase 3: Doctor details

- `app/(dashboard)/doctors/[id]/page.tsx`, `app/(dashboard)/doctors/[id]/_components/doctor-profile.tsx`: profile, breadcrumb, edit/delete, not-found handling and patients section.
- `app/(dashboard)/patients/_components/patient-form-dialog.tsx`, `app/(dashboard)/patients/_components/patients-list.tsx`: shared patient form/list, nested add/delete, filters, pagination and mobile cards.

### Phase 4: Patients

- `app/(dashboard)/patients/page.tsx`: full directory and page metadata.
- Shared patient components: global add/edit/delete, doctor reassignment, cached doctor filter and condition/date/sort filters.

### Phase 5: Dashboard

- `app/(dashboard)/page.tsx`, `app/(dashboard)/_components/dashboard-overview.tsx`: live summary cards and chart layout.
- `app/(dashboard)/_components/timeline-chart.tsx`: doctor/patient registration timeline and 7d/30d/12m controls.
- `app/(dashboard)/_components/doctor-load-chart.tsx`: top-10 horizontal patient load chart.
- `app/(dashboard)/_components/conditions-chart.tsx`: donut, total and legend.

### Phase 6: Login, shadcn controls and final polish

- `app/(auth)/login/page.tsx`, `app/(auth)/login/_components/login-form.tsx`, `lib/auth-api.ts`: responsive split login layout with existing auth flow/password toggle.
- `components/ui/select.tsx`, `components/ui/calendar.tsx`, `components/ui/pagination.tsx`: shadcn controls generated using the existing Radix Nova configuration.
- `components/ui/tracker-shared.tsx`: shadcn Select everywhere in toolbars, calendar range Popover with presets and Apply/Clear, 40px pagination buttons.
- Doctor/patient forms: shadcn Select for specialization, gender, condition and doctor assignment.
- `components/ui/button.tsx`: consistent control sizes and proper positioning for accessible labels.
- `components/ui/dialog.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/sheet.tsx`, `components/ui/alert-dialog.tsx`: aligned Radix primitive imports with the installed `radix-ui` package to prevent mixed-version overlay/pointer-lock bugs.
- `components/auth/portal-session.tsx`: contained positioned descendants so mobile pages do not acquire empty document scroll space.
- `providers/app-provider.tsx`: dismissible top-center notifications that do not cover row action menus.
- `package.json`, `package-lock.json`: required dependencies.
- `README.md`, `IMPLEMENTATION.md`: setup and handover.

## Added application packages

- `recharts`: charts.
- `react-day-picker`: shadcn Calendar.
- `date-fns`: calendar date formatting and presets.

Playwright and Prettier were installed only in a temporary QA folder, outside this project. They were not added to application dependencies.

## Performance and accessibility

- List queries: 30-second stale time and `keepPreviousData`.
- Dashboard queries: 60-second stale time; doctor picker cached for 60 seconds.
- Pagination prefetches the next page and corrects pages that become empty after deletion.
- Search debounces by 400ms, retains focus, and syncs to URL state without full navigation.
- Related doctor/patient/dashboard query keys are invalidated after mutations; auth is unaffected.
- All three chart modules use `next/dynamic` with `ssr: false` and skeleton fallbacks.
- Forms mount only while open; heavy record rows/cards use `React.memo`.
- Desktop tables switch to cards below the large breakpoint, without horizontal page scrolling.
- Dialogs, menus, Select and calendar use shadcn/Radix keyboard behavior. Inputs have labels; pagination and icon buttons have accessible names.
- Existing dark mode remains available. Chart values also have accessible text summaries or legends.

## Assumptions and limits

- `NEXT_PUBLIC_API_URL` continues to point to the existing Express API, normally `http://localhost:5000/api`.
- Creation forms use the supplied specialization/condition constants. The doctor specialization filter uses only distinct values found in database records. Legacy values remain available when editing existing records.
- Doctor filter/assignment options use the requested first 100 doctors. Existing assignments outside this list are preserved when editing; patients can also be added from any doctor profile.
- Created dates and date presets use Asia/Dhaka. A single start date means that date onward; the date range is applied only when Apply is clicked.
- Profile metadata uses the static title “Doctor details”; the doctor’s actual name is shown in the breadcrumb/profile after the protected query resolves.
- Browser verification used an isolated fixture API. It validates frontend behavior and request paths, but does not claim database-backed end-to-end validation against the running backend.

## Verification

- Phase 1 through Phase 5: `npx tsc --noEmit` and `npm run lint` passed at each phase boundary.
- Final Phase 6: `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed.
- Production app was tested in headless Chromium against isolated API fixtures; no browser runtime errors were reported.
- Verified login validation/password visibility/protected redirect/logout, dashboard chart range controls, 40px pagination, page sizes, debounced search focus, URL filters/date ranges, doctor CRUD/duplicate email, doctor profile/nested patient add-delete, global patient add-delete, patient edit/reassignment, not-found handling, cascade warning, refreshed URL state, out-of-range pagination, mobile navigation/cards/dark mode, and 401 recovery.
- Checked mobile document bounds at 375×812: no horizontal overflow or extra blank document scroll space.

## Live API manual test checklist

### Follow-up: database specialization facets

`DataTableFacetedFilter` now supports controlled single selection for the backend's single specialization parameter while retaining its original table-column/multiple-selection behavior for other uses. A cached, cancellable query collects unique specialization values and counts across every 100-record page, since the existing backend has no distinct-values endpoint. Doctor mutations invalidate this query through the existing doctor key prefix. Filters do not restrict the option source.

Select controls and date triggers use content-fit widths; doctor/patient toolbars wrap around a fixed-width search input. Form selects also fit their contents. No package or backend changes were required for this follow-up.

Typecheck, zero-warning lint and production build passed. Targeted fixture browser checks confirmed a Cardiology-only database produces exactly one option, an additional specialization in record 101 is included, selection/clear syncs to the URL, sort width fits its content, and mobile has no horizontal overflow or runtime errors.

The following checks should use a disposable doctor and patient in your actual backend. Fixture checks above are separate from these live checks.

- [ ] Log in with valid credentials; verify invalid credentials, show/hide password, refresh, protected routes and logout.
- [ ] Create, view and edit a doctor. Try invalid fields and duplicate email.
- [ ] Delete a disposable doctor; verify its patient count warning and actual patient cascade.
- [ ] Add/delete patients from a doctor profile; confirm count/list/dashboard refresh.
- [ ] Add, edit, reassign and delete a patient from Patients; confirm doctor details/counts refresh.
- [ ] Search, filter specialization/condition/doctor, set/clear date ranges and change sort.
- [ ] Change pages and page sizes; verify next-page prefetch, totals, URL sharing/refresh, and browser Back/Forward.
- [ ] Verify dashboard totals, horizontal bars, condition legend/total and timeline 7d/30d/12m against database records.
- [ ] Check empty data, filtered-empty results, missing doctor IDs, API failures/retry, 400/409 fields and 429 messages.
- [ ] Check 375px mobile, tablet and desktop; open menus/dialogs/calendars with keyboard and test dark mode.
- [ ] Expire the session and verify 401 recovery clears the cookie and returns to Login.
