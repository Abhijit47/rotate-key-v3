'use client';

import { Pagination, UsePaginationReturn } from '@ark-ui/react/pagination';
import { IconHomePlus } from '@tabler/icons-react';
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import Link from 'next/link';
import { UseQueryStatesReturn } from 'nuqs';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortOrderEnum } from '@/constants/property-assets-enums';
import { cn } from '@/lib/utils';
import { useProperty } from '../hooks/use-property';
import {
  basicFilterAddonParams,
  basicFilterAndPaginateParams,
} from '../searchParams';

export function EmptyPropertiesState() {
  return (
    <Empty className='mx-auto border border-dashed min-w-sm'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconHomePlus />
        </EmptyMedia>
        <EmptyTitle>No Properties Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any properties yet. Get started by creating
          your first property listing.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-wrap justify-center items-center gap-2'>
        <Button asChild>
          <Link href='/property/new'>Create Property</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link href='/swapings'>Explore Swapings</Link>
        </Button>
      </EmptyContent>
      <Button
        variant='link'
        asChild
        className='text-muted-foreground'
        size='sm'>
        <Link href='#'>
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}

type SortAndLimitFilterProps = {
  pagination: UsePaginationReturn;
  queryStates: UseQueryStatesReturn<
    typeof basicFilterAndPaginateParams | typeof basicFilterAddonParams
  >;
  isPending?: boolean;
  isLabelShow?: boolean;
};

export function SortAndLimitFilter(props: SortAndLimitFilterProps) {
  const { pagination, queryStates, isPending, isLabelShow } = props;
  // const { isTransition, startTransition } = usePropertyFilter();
  // const [{ limit, sort }, setValues] = useQueryStates(
  //   basicFilterAndPaginateParams,
  //   {
  //     shallow: false,
  //     scroll: true,
  //     history: "replace",
  //     startTransition,
  //     limitUrlUpdates: {
  //       method: "throttle",
  //       timeMs: 250,
  //     },
  //   },
  // );

  const [{ limit, sort }, setValues] = queryStates;

  return (
    <div className='flex flex-wrap md:flex-nowrap items-center gap-3'>
      <Field className='gap-2'>
        <FieldLabel
          htmlFor='per-page'
          className={cn(isLabelShow ? '' : 'sr-only')}>
          Items per page:
        </FieldLabel>
        <Select
          disabled={isPending}
          value={String(pagination.pageSize)}
          onValueChange={(value) => {
            setValues((prev) => {
              return {
                ...prev,
                limit: value,
              };
            });
            pagination.setPageSize(Number(value));
          }}>
          <SelectTrigger className='w-full' id='per-page' size='sm'>
            <SelectValue placeholder={`show ${limit} properties`}>
              Show {limit} properties
            </SelectValue>
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              <SelectLabel>Per Page</SelectLabel>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className='gap-2'>
        <FieldLabel
          htmlFor='sort-order'
          className={cn(isLabelShow ? '' : 'sr-only')}>
          Sort
        </FieldLabel>
        <Select
          disabled={isPending}
          value={sort}
          onValueChange={(value) => {
            setValues((prev) => {
              return {
                ...prev,
                sort: value as 'asc' | 'desc',
              };
            });
          }}>
          <SelectTrigger className='w-full' id='sort-order' size='sm'>
            <SelectValue placeholder={`Order by ${sort}`}>
              Order by {sort}
            </SelectValue>
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              <SelectLabel>Sort Order</SelectLabel>
              {Object.entries(sortOrderEnum).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

type PaginateProps = {
  pagination: UsePaginationReturn;
  queryStates: UseQueryStatesReturn<
    typeof basicFilterAndPaginateParams | typeof basicFilterAddonParams
  >;
  isPending?: boolean;
};

export function Paginate(props: PaginateProps) {
  const { pagination, queryStates, isPending } = props;

  // const { isTransition, startTransition } = usePropertyFilter();
  // const [{ offset }, setValues] = useQueryStates(basicFilterAndPaginateParams, {
  //   shallow: false,
  //   scroll: true,
  //   history: "replace",
  //   startTransition,
  //   limitUrlUpdates: {
  //     method: "throttle",
  //     timeMs: 250,
  //   },
  // });

  const [{ offset }, setValues] = queryStates;

  const currentOffset = Number(offset) || 1;

  const disablePrevTrigger = currentOffset <= 1 || isPending;
  const disableNextTrigger =
    currentOffset >= pagination.totalPages || isPending;

  return (
    <div className={'w-full flex items-center justify-center'}>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Pagination.PrevTrigger asChild>
            <Button
              disabled={disablePrevTrigger}
              variant={disablePrevTrigger ? 'ghost' : 'outline'}
              onClick={() => {
                setValues((prev) => {
                  const nextOffset = Math.max(1, Number(prev.offset) - 1);
                  return {
                    ...prev,
                    offset: String(nextOffset),
                  };
                });
              }}>
              <ChevronLeftIcon />
              Prev
            </Button>
          </Pagination.PrevTrigger>
          {pagination.pages.map((page, index) =>
            page.type === 'page' ? (
              <Pagination.Item key={index} {...page} asChild>
                <Button
                  variant={page.value === currentOffset ? 'default' : 'outline'}
                  onClick={() => {
                    setValues((prev) => {
                      return { ...prev, offset: String(page.value) };
                    });
                  }}>
                  {page.value}
                </Button>
              </Pagination.Item>
            ) : (
              <Pagination.Ellipsis
                key={index}
                index={index}
                className={buttonVariants()}>
                &#8230;
              </Pagination.Ellipsis>
            ),
          )}
          <Pagination.NextTrigger asChild>
            <Button
              disabled={disableNextTrigger}
              variant={disableNextTrigger ? 'ghost' : 'outline'}
              onClick={() => {
                setValues((prev) => {
                  // we can go pagination.totalPages upto
                  const nextOffset = Math.min(
                    pagination.totalPages,
                    Number(prev.offset || 1) + 1,
                  );
                  return {
                    ...prev,
                    offset: String(nextOffset),
                  };
                });
              }}>
              Next <ChevronRightIcon />
            </Button>
          </Pagination.NextTrigger>
        </div>

        <p className={'text-muted-foreground text-center text-sm'}>
          Page {pagination.page} of {pagination.totalPages}
        </p>
      </div>
    </div>
  );
}

export function PropertyListing({ propertyId }: { propertyId: string }) {
  const { data: property } = useProperty(propertyId);
  return <div>{JSON.stringify(property, null, 2)}</div>;
}
