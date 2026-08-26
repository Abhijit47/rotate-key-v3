import { format } from 'date-fns';
import { ArrowLeftCircleIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsAndConditionsPage() {
  return (
    <div className={'max-w-5xl mx-auto w-full px-4 2xl:px-0 py-16'}>
      <Card>
        <CardHeader className={'space-y-4'}>
          <CardTitle>
            <h1
              className={
                'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center'
              }>
              Terms and Conditions for Rotatekey
            </h1>
          </CardTitle>
          <CardDescription>
            <div className={'flex flex-col items-center gap-2 text-xs'}>
              <Badge>
                <time dateTime={new Date().toISOString()}>
                  Effective Date: {format(new Date(), 'MMMM dd, yyyy')}
                </time>
              </Badge>
              <Badge>
                <time dateTime={new Date().toISOString()}>
                  Last Updated: {format(new Date(), 'MMMM dd, yyyy')}
                </time>
              </Badge>
            </div>
          </CardDescription>

          <CardDescription>
            <p className={'text-muted-foreground text-sm text-center'}>
              Welcome to Rotate Keys! Before you dive into the exciting world of
              property swapping, please take a moment to review our Terms and
              Conditions. By using Rotate Keys, you agree to comply with these
              terms. Let&apos;s make sure we&apos;re all on the same page.
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className={'space-y-4'}>
          <ol className={'list-decimal list-inside space-y-2'}>
            <li>
              <span className={'font-semibold'}>**Acceptance of Terms:**</span>
              <p className={'text-sm text-muted-foreground'}>
                By accessing or using Rotate Keys, you acknowledge that you have
                read, understood, and agree to be bound by these Terms and
                Conditions. If you do not agree with any part of these terms,
                please do not use our platform.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**User Eligibility:**</span>
              <p className={'text-sm text-muted-foreground'}>
                To use Rotate Keys, you must be at least 18 years old and
                capable of forming a legally binding contract. By accessing our
                platform, you represent and warrant that you meet these
                eligibility requirements.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**Property Listings:**</span>
              <p className={'text-sm text-muted-foreground'}>
                Users are responsible for the accuracy and completeness of their
                property listings. Rotate Keys does not guarantee the
                availability, quality, or legality of any listed properties and
                is not liable for any inaccuracies or misrepresentations.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**Communication:**</span>
              <p className={'text-sm text-muted-foreground'}>
                Rotate Keys provides communication tools for users to interact
                with each other. Users are solely responsible for their
                communications and must comply with all applicable laws and
                regulations. We reserve the right to monitor and moderate user
                communications as necessary.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**Property Swaps:**</span>
              <p className={'text-sm text-muted-foreground'}>
                Users engage in property swaps at their own risk. Rotate Keys is
                not a party to any property swap agreements and does not assume
                any responsibility for the outcome of such transactions. Users
                are encouraged to exercise due diligence and take necessary
                precautions when arranging swaps.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**User Conduct:**</span>
              <p className={'text-sm text-muted-foreground'}>
                While using Rotate Keys, you agree to conduct yourself
                respectfully and lawfully. Prohibited activities include, but
                are not limited to:
              </p>
              <ol className='space-y-1 mt-2 ml-4 text-sm list-[lower-roman] list-inside'>
                <li>Violating any laws or regulations</li>
                <li>Posting fraudulent, misleading, or offensive content</li>
                <li>
                  Interfering with the operation of Rotate Keys or other
                  user&apos;s access to the platform
                </li>
                <li>
                  Engaging in any activity that may harm Rotate Keys or its
                  users
                </li>
              </ol>
            </li>
            <li>
              <span className={'font-semibold'}>
                **Intellectual Property:**
              </span>
              <p className={'text-sm text-muted-foreground'}>
                All content and materials on Rotate Keys, including logos,
                trademarks, and software, are the property of Rotate Keys or its
                licensors and are protected by copyright and other intellectual
                property laws. Users may not use, reproduce, or distribute any
                content from Rotate Keys without prior written permission.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**Privacy:**</span>
              <p className={'text-sm text-muted-foreground'}>
                Rotate Keys values your privacy and handles personal data in
                accordance with our Privacy Policy. By using our platform, you
                consent to the collection, use, and disclosure of your personal
                information as described in the Privacy Policy.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>
                **Disclaimer of Warranties:**
              </span>
              <p className={'text-sm text-muted-foreground'}>
                Rotate Keys is provided &quot;as is&quot; without any
                warranties, express or implied. We do not guarantee the
                accuracy, reliability, or completeness of any content or
                services on the platform. Users use Rotate Keys at their own
                risk.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>
                **Limitation of Liability:**
              </span>
              <p className={'text-sm text-muted-foreground'}>
                In no event shall Rotate Keys be liable for any direct,
                indirect, incidental, special, or consequential damages arising
                out of or in any way connected with the use of our platform or
                the inability to use it.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**Governing Law:**</span>
              <p className={'text-sm text-muted-foreground'}>
                These Terms and Conditions shall be governed by and construed in
                accordance with the laws of [Jurisdiction], without regard to
                its conflict of law provisions.
              </p>
            </li>
            <li>
              <span className={'font-semibold'}>**Changes to Terms:**</span>
              <p className={'text-sm text-muted-foreground'}>
                Rotate Keys reserves the right to modify or update these Terms
                and Conditions at any time. Any changes will be effective
                immediately upon posting on the platform. Continued use of
                Rotate Keys constitutes acceptance of the revised terms.
              </p>
            </li>
          </ol>

          <Separator />

          <p className={'text-xs text-muted-foreground text-center'}>
            <abbr title={'End of Terms and Conditions'}>
              If you have any questions or concerns about these Terms and
              Conditions, please contact us at [contact@email.com]. Thank you
              for choosing Rotate Keys!
            </abbr>
          </p>
        </CardContent>

        <Separator />

        <CardFooter className={'w-full flex items-center justify-center'}>
          <Link
            href={'/'}
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
            })}>
            <ArrowLeftCircleIcon />
            Go Back
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
