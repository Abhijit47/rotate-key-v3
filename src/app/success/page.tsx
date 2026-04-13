import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IconCopy } from '@tabler/icons-react';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams: Promise<{
    checkout_id: string;
    customer_session_token: string;
  }>;
};
export default async function PaymentSuccessPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const checkoutId = searchParams.checkout_id;
  // const customerSessionToken = searchParams.customer_session_token;

  return (
    <main className={'h-dvh flex items-center justify-center'}>
      <Card className={'max-w-md mx-auto gap-4'}>
        <CardHeader>
          <CardTitle className={'text-center'}>Payment Successful!</CardTitle>
          <CardDescription>
            Your payment was successful. You can now access your premium
            features.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <CardAction>
            <Button title='Copy' variant={'outline'} size={'icon-xs'}>
              <IconCopy className={'size-4'} />
            </Button>
          </CardAction>
          <code className={'font-serif text-xs inline-block'}>
            Checkout ID: {checkoutId}
          </code>
        </CardContent>
        <CardFooter>
          <Link
            href='/'
            className={buttonVariants({
              variant: 'default',
              size: 'sm',
              className: 'w-full',
            })}>
            <ArrowLeftCircle className={'size-4'} />
            Go to Home
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
