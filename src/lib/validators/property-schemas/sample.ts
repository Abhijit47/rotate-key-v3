// import z from "zod";
// import libphonenumber from "google-libphonenumber";

// import { emailRegex, validatePostalCode } from "@/lib/helpers/property-helpers";

// import {
//   hostLanguages,
//   propertyAccomodationsEnum,
//   propertyEnvironmentsEnum,
//   propertyOwnershipsEnum,
//   propertySurroundingsEnum,
//   propertySwapingsEnum,
//   propertyTypesEnum,
// } from "@/constants/property-assets";

// const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
// const propertyAreaUnit = /^(sqft|sqm|acre|hectare)$/;
// const hostLanguageEnum = hostLanguages.map((language) => language.language) as [
//   string,
//   ...string[],
// ];

// const wizardRegistry = z.registry<{ step: number }>();

// export const grp1 = z
//   .object({
//     streetAddress: z
//       .string()
//       .min(1, {
//         error: "Street address must be 1 to 50 characters.",
//       })
//       .max(50, {
//         error: "Street address must be 1 to 50 characters.",
//       }),
//     countryOrNation: z
//       .object({
//         id: z.number({ error: "Choose a country" }),
//         name: z.string({ error: "Choose a country" }),
//       })
//       .superRefine((data, ctx) => {
//         if (data.name.length < 1) {
//           ctx.addIssue({
//             code: "too_small",
//             origin: "string",
//             minimum: 1,
//             inclusive: true,
//             path: ["countryOrNation"],
//             message: "Choose a country",
//           });
//           ctx.aborted = true;
//         }
//         return;
//       }),
//     stateOrProvince: z
//       .object({
//         id: z.number({ error: "Choose a state" }),
//         name: z.string({ error: "Choose a state" }),
//       })
//       .superRefine((data, ctx) => {
//         if (data.name.length < 1) {
//           ctx.addIssue({
//             code: "too_small",
//             origin: "string",
//             minimum: 1,
//             inclusive: true,
//             path: ["stateOrProvince"],
//             message: "Choose a state",
//           });
//           ctx.aborted = true;
//         }
//       }),
//     cityOrTown: z
//       .object({
//         id: z.number({ error: "Choose a city" }),
//         name: z.string({ error: "Choose a city" }),
//       })
//       .superRefine((data, ctx) => {
//         if (data.name.length < 1) {
//           ctx.addIssue({
//             code: "too_small",
//             origin: "string",
//             minimum: 1,
//             inclusive: true,
//             path: ["cityOrTown"],
//             message: "Choose a city",
//           });
//           ctx.aborted = true;
//         }
//       }),
//     zipcode: z.string().superRefine((data, ctx) => {
//       if (!validatePostalCode(data, "IN")) {
//         console.log("fail-status:", validatePostalCode(data, "IN"));
//         ctx.addIssue({
//           code: "invalid_format",
//           format: "postal-code",
//           validation: "regex",
//           path: ["zipcode"],
//           message: "Invalid postal code",
//         });
//         ctx.aborted = true;
//       } else {
//         console.log("pass-status:", validatePostalCode(data, "IN"));
//         ctx.aborted = false;
//       }
//     }),
//   })
//   .describe("Property location");

// export const grp2 = z
//   .object({
//     propertyArea: z
//       .string()
//       .min(1, { error: "Property area is required" })
//       .max(50, { error: "Property area must be 1 to 50 characters." }),
//     propertyAreaUnit: z.string().regex(propertyAreaUnit, {
//       error: "Please select a valid area unit.",
//     }),
//     propertyDescription: z
//       .string()
//       .min(10, {
//         error: "Property description must be 10 character.",
//       })
//       .max(3000, {
//         error: "Property description max limit 1000 character.",
//       }),
//   })
//   .describe("Size and description");

// export const grp3 = z
//   .object({
//     propertyType: z.enum(propertyTypesEnum, {
//       error: "Please select a room type.",
//     }),

//     propertyOwnership: z.enum(propertyOwnershipsEnum, {
//       error: "Please select a room ownership.",
//     }),

//     propertySwaping: z.enum(propertySwapingsEnum, {
//       error: "Please select a swaping type.",
//     }),

//     propertyRentalTypes: z
//       .string()
//       .min(1, { error: "Property rental type is required" })
//       .max(50, { error: "Property rental type must be 1 to 50 characters." }),

//     propertySurrounding: z.enum(propertySurroundingsEnum, {
//       error: "Please select a valid room surrounding",
//     }),

//     propertyEnvironment: z.enum(propertyEnvironmentsEnum, {
//       error: "Please select a valid room environment",
//     }),
//   })
//   .describe("Listing classification");

// export const grp4 = z
//   .object({
//     propertyBedRooms: z.string().superRefine((data, ctx) => {
//       if (data === "") {
//         ctx.addIssue({
//           code: "too_small",
//           origin: "string",
//           minimum: 1,
//           inclusive: true,
//           path: ["propertyBedRooms"],
//           message: "Bedrooms must be at least 1",
//         });
//         ctx.aborted = true;
//       } else {
//         ctx.aborted = false;
//       }
//     }),
//     propertyBathRooms: z.string().superRefine((data, ctx) => {
//       if (data === "") {
//         ctx.addIssue({
//           code: "too_small",
//           origin: "string",
//           minimum: 1,
//           inclusive: true,
//           path: ["propertyBathRooms"],
//           message: "Bathrooms must be at least 1",
//         });
//         ctx.aborted = true;
//       } else {
//         ctx.aborted = false;
//       }
//     }),
//     numberOfGuests: z.string().superRefine((data, ctx) => {
//       if (data === "") {
//         ctx.addIssue({
//           code: "too_small",
//           origin: "string",
//           minimum: 1,
//           inclusive: true,
//           path: ["numberOfGuests"],
//           message: "Guests must be at least 1",
//         });
//         ctx.aborted = true;
//       } else {
//         ctx.aborted = false;
//       }
//     }),
//     numberOfBeds: z.string().superRefine((data, ctx) => {
//       if (data === "") {
//         ctx.addIssue({
//           code: "too_small",
//           origin: "string",
//           minimum: 1,
//           inclusive: true,
//           path: ["numberOfBeds"],
//           message: "Beds must be at least 1",
//         });
//         ctx.aborted = true;
//       } else {
//         ctx.aborted = false;
//       }
//     }),
//     propertyAccomodationType: z.enum(propertyAccomodationsEnum, {
//       error: "Please select an accomodation type.",
//     }),
//   })
//   .describe("Space and bedding capacity");

// export const grp5 = z
//   .object({
//     propertyOwnerName: z
//       .string()
//       .optional()
//       .superRefine((data, ctx) => {
//         if (data) {
//           if (data.length < 3) {
//             ctx.addIssue({
//               code: "too_small",
//               origin: "string",
//               minimum: 3,
//               inclusive: true,
//               message: "Owner name must be at least 3 characters",
//             });
//           }
//           ctx.aborted = true;
//         } else {
//           ctx.aborted = false;
//         }
//       }),
//     propertyOwnerEmail: z
//       .string()
//       .optional()
//       .superRefine((data, ctx) => {
//         if (data) {
//           if (!emailRegex.test(data)) {
//             ctx.addIssue({
//               code: "invalid_format",
//               format: "email",
//               path: ["propertyOwnerEmail"],
//               message: "Invalid email address",
//             });
//             ctx.aborted = true;
//           } else {
//             ctx.aborted = false;
//           }
//         }
//       }),
//     propertyOwnerPhone: z
//       .string()
//       .optional()
//       .superRefine((data, ctx) => {
//         if (data) {
//           const phoneNumber = phoneUtil?.parse(data);
//           try {
//             if (!phoneUtil.isPossibleNumber(phoneNumber)) {
//               ctx.addIssue({
//                 code: "invalid_format",
//                 format: "phone",
//                 path: ["propertyOwnerPhone"],
//                 message: "Invalid mobile number",
//               });
//               ctx.aborted = true;
//             } else {
//               ctx.aborted = false;
//             }
//           } catch (error) {
//             console.warn(error, "Couldn't validate phone number");
//             ctx.addIssue({
//               code: "custom",
//               path: ["propertyOwnerPhone"],
//               message: "Couldn't validate phone number",
//             });
//             ctx.aborted = true;
//           }
//         }
//       }),
//     hostLanguages: z
//       .array(z.enum(hostLanguageEnum), {
//         error: "Please select a valid languages.",
//       })
//       .min(1, "At least one language must be selected."),
//   })
//   .describe("Host details and languages");

// export const grp6 = z
//   .object({
//     propertyAmenities: z
//       .array(
//         z
//           .string({ error: "At least one amenity must be selected." })
//           .nonempty({ error: "At least one amenity must be selected." }),
//       )
//       .refine((amenities) => amenities.length > 0, {
//         path: ["propertyAmenities"],
//         error: "At least one amenity must be selected.",
//         abort: true,
//       }),
//   })
//   .describe("Amenities & conveniences");

// export const grp7 = z
//   .object({
//     propertyAccessibilities: z
//       .array(
//         z
//           .string({
//             error: "At least one accessibilities must be selected.",
//           })
//           .nonempty({
//             error: "At least one accessibilities must be selected.",
//           }),
//       )
//       .refine((accessibilities) => accessibilities.length > 0, {
//         path: ["propertyAccessibilities"],
//         error: "At least one accessibilities must be selected.",
//         abort: true,
//       }),
//   })
//   .describe("Accessibility features");

// export const grp8 = z
//   .object({
//     propertyRules: z
//       .array(
//         z
//           .string({ error: "At least one rules must be selected." })
//           .nonempty({ error: "At least one rules must be selected." }),
//       )
//       .refine((rules) => rules.length > 0, {
//         path: ["propertyRules"],
//         error: "At least one rules must be selected.",
//         abort: true,
//       }),
//   })
//   .describe("House rules and policies");

// export const grp9 = z
//   .object({
//     staysDateRange: z.object({
//       from: z.date({
//         error: "Start date is required",
//       }),
//       to: z.date({
//         error: "End date is required",
//       }),
//     }),
//     staysDurationInDays: z.string(),
//   })
//   .describe("Availibility and stay dates");

// export const grp10 = z
//   .object({
//     /* Temp. Local files store for performing upload */
//     files: z
//       .array(z.custom<File & { publicId?: string }>())
//       .min(1, "Please select at least one file")
//       .max(6, "Please select up to 6 files")
//       .refine((files) => files.every((file) => file.size <= 10 * 1024 * 1024), {
//         message: "File size must be less than 10MB",
//         path: ["files"],
//       }),
//     /* Property Images */
//     propertyImages: z
//       .array(z.url())
//       .refine(
//         (urls) => urls.some((url) => url !== ""),
//         "At least one image is required",
//       ),
//   })
//   .describe("Photos and media uploads");

// export const grp1WithStep = grp1.register(wizardRegistry, { step: 1 });
// export const grp2WithStep = grp2.register(wizardRegistry, { step: 2 });
// export const grp3WithStep = grp3.register(wizardRegistry, { step: 3 });
// export const grp4WithStep = grp4.register(wizardRegistry, { step: 4 });
// export const grp5WithStep = grp5.register(wizardRegistry, { step: 5 });
// export const grp6WithStep = grp6.register(wizardRegistry, { step: 6 });
// export const grp7WithStep = grp7.register(wizardRegistry, { step: 7 });
// export const grp8WithStep = grp8.register(wizardRegistry, { step: 8 });
// export const grp9WithStep = grp9.register(wizardRegistry, { step: 9 });
// export const grp10WithStep = grp10.register(wizardRegistry, { step: 10 });

// export const wizardSchema = z.object({
//   grp1: grp1WithStep,
//   grp2: grp2WithStep,
//   grp3: grp3WithStep,
//   grp4: grp4WithStep,
//   grp5: grp5WithStep,
//   grp6: grp6WithStep,
//   grp7: grp7WithStep,
//   grp8: grp8WithStep,
//   grp9: grp9WithStep,
//   grp10: grp10WithStep,
// });

// export type WizardSchemaShape = typeof wizardSchema.shape;

// /*
// A) Reducer shape #1: step → group keys (no nesting)

// This is the “group-level” reducer. It returns the group keys per step.
// */

// /*
// type WizardValues = z.infer<typeof wizardSchema>;
// type GroupKey = keyof WizardValues; // "grp1" | ... | "grp10"

// export const stepGroups = (
//   Object.entries(wizardSchema.shape) as Array<
//     [GroupKey, (typeof wizardSchema.shape)[GroupKey]]
//   >
// ).reduce((acc, [groupKey, groupSchema]) => {
//   const meta = wizardRegistry.get(groupSchema);
//   if (!meta)
//     throw new Error(`Missing step metadata for group: ${String(groupKey)}`);
//   (acc[meta.step] ??= []).push(groupKey);
//   return acc;
// }, [] as GroupKey[][]);
// */

// /*
// B) Reducer shape #2: step → flattened field paths like "grp4.propertyBedRooms"

// This is usually the most practical for forms (you can map to RHF field names, show errors, etc.).

// Important: this reducer still uses the group step metadata (registered on the group), then walks each group’s .shape to list its field keys. .shape is the supported way to access object fields.
// */
// type WizardValues = z.infer<typeof wizardSchema>;
// type GroupKey = keyof WizardValues;

// type FlatFieldPath = `${Extract<GroupKey, string>}.${string}`;

// export const stepFlatFields = (
//   Object.entries(wizardSchema.shape) as Array<
//     [GroupKey, WizardSchemaShape[GroupKey]]
//   >
// ).reduce((acc, [groupKey, groupSchema]) => {
//   const meta = wizardRegistry.get(groupSchema);
//   if (!meta)
//     throw new Error(`Missing step metadata for group: ${String(groupKey)}`);

//   // groupSchema is a Zod object schema, so it has `.shape`
//   const fieldKeys = Object.keys(groupSchema.shape);

//   for (const fieldKey of fieldKeys) {
//     const path = `${String(groupKey)}.${fieldKey}` as FlatFieldPath;
//     (acc[meta.step] ??= []).push(path);
//   }

//   return acc;
// }, [] as FlatFieldPath[][]);

// /*
// Option B (the flattened field paths) is the one that matches how react-hook-form’s trigger(fields) is typically used: it expects field names/paths, not “group names”.
// Why not Option A (group keys)?

//     Option A gives you ["grp1", "grp2", ...].
//     trigger(["grp1"]) would only make sense if your form actually has a registered field named "grp1" (it usually doesn’t). In most RHF setups, your registered fields are things like "streetAddress" or nested paths like "grp1.streetAddress".

// Use Option B (flat paths)

// Use the reducer that returns paths like:

//     "grp1.streetAddress"
//     "grp1.zipcode"
//     "grp2.propertyArea" …then:

// ts
// const next = async () => {
//   const fieldsForThisStep = stepFlatFields[step]; // e.g. ["grp1.streetAddress", ...]
//   const ok = await trigger(fieldsForThisStep);
//   if (!ok) return;
//   setStep((s) => Math.min(s + 1, stepFlatFields.length - 1));
// };

// One important alignment check

// This only works if your RHF field registration uses the same names:

//     register("grp1.streetAddress")
//     or <Controller name="grp1.streetAddress" ... />

// If instead your form registers fields without the grp1. prefix (like "streetAddress"), then you’d want a reducer that returns unprefixed keys for each step (or you’d restructure your schema to be flat at the top level).

// If you paste one example of how you register a field in RHF (e.g. register(...) / Controller name=...), I can tell you definitively which naming shape to generate.
// */
