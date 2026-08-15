import { AlertTriangleIcon } from 'lucide-react';
import { FieldErrors, useFormContext, useFormState } from 'react-hook-form';

import { usePropertyContext } from '@/contexts/property-context';
import {
  type WizardFieldKey,
  type WizardValues,
  currentStepFields,
} from '@/lib/validators/property-schemas';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

type FlatErrors = Record<string, string>;

function flattenRHFErrors(
  errors: FieldErrors<WizardValues>,
  prefix = '',
): FlatErrors {
  const out: FlatErrors = {};

  if (!errors || typeof errors !== 'object') return out;

  for (const [key, value] of Object.entries(errors)) {
    const path = prefix ? `${prefix}.${key}` : key;

    // leaf error
    if (
      value &&
      typeof value === 'object' &&
      typeof value.message === 'string'
    ) {
      out[path] = value.message;
      continue;
    }

    // nested
    Object.assign(
      out,
      flattenRHFErrors(value as FieldErrors<WizardValues>, path),
    );
  }

  return out;
}

function filterFlatErrorsByStep(
  flat: FlatErrors,
  fieldsForStep: readonly WizardFieldKey[],
) {
  const allowed = new Set<string>(fieldsForStep as readonly string[]);

  return Object.fromEntries(
    Object.entries(flat).filter(([path]) => {
      const top = path.split('.')[0];
      return allowed.has(top);
    }),
  );
}

type DrawerItem = { field: string; message: string };
function flatErrorsToList(stepFlat: FlatErrors): DrawerItem[] {
  // return Object.entries(stepFlat).map(([path, message]) => {
  //   const top = path.split(".")[0];
  //   return { [top]: message };
  // });
  return Object.entries(stepFlat).map(([path, message]) => {
    const field = path.split('.')[0]; // top-level field
    return { field, message };
  });
}

/**
 * 
 * Optional: de-dupe so each top-level field appears once
  -If nested errors generate multiple entries for the same top field, you can keep only the first:
 * 
  ```
  function flatErrorsToList(stepFlat: FlatErrors): DrawerItem[] {
  const seen = new Set<string>();
  const out: DrawerItem[] = [];

  for (const [path, message] of Object.entries(stepFlat)) {
    const field = path.split(".")[0];
    if (seen.has(field)) continue;
    seen.add(field);
    out.push({ field, message });
  }

  return out;
}
  ```
 */

function getDrawerListForStep(
  formErrors: FieldErrors<WizardValues>,
  step: number,
) {
  const fieldsForThisStep = currentStepFields[step] ?? [];
  const flat = flattenRHFErrors(formErrors);
  const stepFlat = filterFlatErrorsByStep(flat, fieldsForThisStep);
  return flatErrorsToList(stepFlat);
}

export default function FormErrorDrawer() {
  const { isErrorDrawerOpen, onToggleErrorDrawer, step } = usePropertyContext();

  const form = useFormContext<WizardValues>();
  const { errors } = useFormState({ control: form.control });
  const list = getDrawerListForStep(errors, step);

  // console.log("list", JSON.stringify(list, null, 2));

  return (
    <Drawer
      direction='top'
      open={isErrorDrawerOpen && list.length > 0}
      onOpenChange={onToggleErrorDrawer}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='flex flex-col justify-center items-center gap-2'>
            <AlertTriangleIcon className='size-8 text-destructive' />
            Something went wrong!
          </DrawerTitle>
          <DrawerDescription className='text-center'>
            Please fix the errors and try again.
          </DrawerDescription>
        </DrawerHeader>

        <div className='bg-accent/50 mx-auto p-4 border-border border-dashed rounded-lg w-full max-w-lg'>
          <ul>
            {list.map((err) => (
              <li key={crypto.randomUUID()} className='space-y-2'>
                <strong className='text-destructive'>{err.field}</strong> :{' '}
                <span className='text-foreground'>{err.message}</span>
              </li>
            ))}
            {/* {list.map((errObj, i) => {
              const [field, message] = Object.entries(errObj)[0]; // one key per object
              return (
                <li key={`${field}-${i}`}>
                  <strong className="text-destructive">{field}</strong>:{" "}
                  <span className="text-foreground">{message}</span>
                </li>
              );
            })} */}
          </ul>
        </div>

        <DrawerFooter className='justify-center items-center'>
          {/* <Button>Submit</Button> */}
          <DrawerClose asChild>
            <Button variant='outline' size='xs'>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
