import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Field } from '@/components/ui/field';

export function PersoalLoading() {
  return (
    <div className='px-4 lg:px-6 space-y-6'>
      <div className={'grid grid-cols-12 gap-4'}>
        <div className={'col-span-full lg:col-span-8'}>
          <Card className={'gap-3 py-4'}>
            <CardContent className={'space-y-4'}>
              <Skeleton className='h-3 w-48' />
              <Separator />

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='size-28 rounded-full' />
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='h-8 w-20' />
                    <Skeleton className='h-8 w-20' />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <Field className='gap-2'>
                    <Skeleton className='h-2 w-16' />
                    <Skeleton className='h-8 w-full' />
                  </Field>
                  <Field className='gap-2'>
                    <Skeleton className='h-2 w-16' />
                    <Skeleton className='h-8 w-full' />
                  </Field>
                </div>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <Field className='gap-2'>
                  <Skeleton className='h-2 w-16' />
                  <Skeleton className='h-8 w-full' />
                </Field>
                <Field className='gap-2'>
                  <Skeleton className='h-2 w-16' />
                  <Skeleton className='h-8 w-full' />
                </Field>
              </div>
              <Field className='gap-2'>
                <Skeleton className='h-2 w-16' />
                <Skeleton className='h-12 w-full' />
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className={'col-span-full lg:col-span-4'}>
          <Skeleton className='h-76 w-full' />
        </div>
      </div>

      <div className={'grid grid-cols-12 gap-4'}>
        <div className={'col-span-full space-y-2'}>
          <Skeleton className='h-3 w-48' />
          <div className='space-y-2'>
            <Skeleton className='h-14 w-full' />
            <Skeleton className='h-14 w-full' />
            <Skeleton className='h-14 w-full' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfidentalLoading() {
  return (
    <div className='px-4 lg:px-6 space-y-6'>
      <div className={'grid grid-cols-12 gap-4'}>
        <div className={'col-span-full lg:col-span-8'}>
          <Card className={'gap-3 py-4'}>
            <CardContent className={'space-y-4'}>
              <Skeleton className='h-3 w-48' />
              <Separator />

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <Field className='gap-2'>
                  <Skeleton className='h-2 w-16' />
                  <Skeleton className='h-8 w-full' />
                </Field>
                <Field className='gap-2'>
                  <Skeleton className='h-2 w-16' />
                  <Skeleton className='h-8 w-full' />
                </Field>
              </div>
              <Field className='gap-2'>
                <Skeleton className='h-2 w-16' />
                <Skeleton className='h-8 w-full' />
              </Field>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <Field className='gap-2'>
                  <Skeleton className='h-2 w-16' />
                  <Skeleton className='h-8 w-full' />
                </Field>
                <Field className='gap-2'>
                  <Skeleton className='h-2 w-16' />
                  <Skeleton className='h-8 w-full' />
                </Field>
              </div>
              <Skeleton className='h-8 w-full' />
            </CardContent>
          </Card>
        </div>
        <div className={'col-span-full lg:col-span-4'}>
          <Skeleton className='h-76 w-full' />
        </div>
      </div>
      <div className={'grid grid-cols-12 gap-4'}>
        <div className={'col-span-full space-y-2'}>
          <Skeleton className='h-3 w-48' />
          <div className='space-y-2'>
            <Skeleton className='h-14 w-full' />
            <Skeleton className='h-14 w-full' />
            <Skeleton className='h-14 w-full' />
          </div>
        </div>
      </div>
    </div>
  );
}
