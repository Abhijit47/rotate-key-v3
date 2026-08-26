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

export default function PrivacyPolicyPage() {
  return (
    <div className={'max-w-4xl mx-auto w-full px-4 2xl:px-0 py-16'}>
      <Card>
        <CardHeader className={'space-y-4'}>
          <CardTitle>
            <h1
              className={
                'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center'
              }>
              Privacy Policy for Rotatekey
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
        </CardHeader>

        <CardContent className={'space-y-6'}>
          <p className={'text-sm text-muted-foreground text-center'}>
            Rotatekey (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your personal
            information when you visit our website{' '}
            <abbr title={'https://www.rotatekey.com'}>
              <Link
                href={'https://www.rotatekey.com'}
                className={'font-semibold'}>
                www.rotatekey.com
              </Link>
            </abbr>{' '}
            and use our property swapping services. By accessing or using our
            website and services, you agree to the terms of this Privacy Policy.
          </p>
          <Separator />

          <ol className={'list-decimal list-inside space-y-2'}>
            <li className={'space-y-2'}>
              <span className={'font-semibold'}>Information We Collect</span>
              <p className={'text-sm text-muted-foreground'}>
                We collect the following types of information to provide and
                improve our property swapping platform:
              </p>
              <ol className='space-y-2 mt-2 ml-4 text-sm list-[lower-alpha] list-inside'>
                <li>
                  <span className={'font-semibold'}>
                    Information You Provide to Us:
                  </span>
                  <ol className='space-y-1 mt-1 ml-4 text-sm list-disc list-inside'>
                    <li>
                      <strong>Account Information: </strong>
                      <span className={'text-muted-foreground'}>
                        When you create an account on Rotatekey, we collect your
                        name, email address, phone number, and password.
                      </span>
                    </li>
                    <li>
                      <strong>Property Information: </strong>
                      <span className={'text-muted-foreground'}>
                        Details about your property that you wish to swap,
                        including location, description, photos, and
                        availability.
                      </span>
                    </li>
                    <li>
                      <strong>Communication Data: </strong>
                      <span className={'text-muted-foreground'}>
                        Any information you provide through messages or
                        inquiries with other users or our customer support team.
                      </span>
                    </li>
                  </ol>
                </li>

                <li>
                  <span className={'font-semibold'}>
                    Automatically Collected Information:
                  </span>
                  <ol className='space-y-1 mt-1 ml-4 text-sm list-disc list-inside'>
                    <li>
                      <strong>Log Data: </strong>
                      <span className={'text-muted-foreground'}>
                        We collect data such as your IP address, browser type,
                        device information, and browsing activity on the
                        website.
                      </span>
                    </li>
                    <li>
                      <strong>Cookies: </strong>
                      <span className={'text-muted-foreground'}>
                        We use cookies to enhance your user experience by
                        remembering preferences, login details, and tracking
                        usage patterns.
                      </span>
                    </li>
                    <li>
                      <strong>Usage Data: </strong>
                      <span className={'text-muted-foreground'}>
                        Information about how you interact with the site,
                        including pages visited, time spent, and the actions
                        taken.
                      </span>
                    </li>
                  </ol>
                </li>

                <li>
                  <span className={'font-semibold'}>
                    Information from Third Parties:
                  </span>
                  <ol className='space-y-1 mt-1 ml-4 text-sm list-disc list-inside'>
                    <li>
                      <strong>Social Media: </strong>
                      <span className={'text-muted-foreground'}>
                        If you log in or sign up through third-party social
                        media accounts (e.g., Facebook, Google), we may collect
                        basic profile information such as your name and email
                        address.
                      </span>
                    </li>
                    <li>
                      <strong>Third-Party Service Providers: </strong>
                      <span className={'text-muted-foreground'}>
                        Information shared with payment processors or other
                        third-party services used to facilitate transactions or
                        service delivery.
                      </span>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>
                How We Use Your Information
              </span>
              <p className={'text-sm text-muted-foreground'}>
                We use the information we collect for the following purposes:
              </p>
              <ol className='space-y-1 ml-4 text-sm list-disc list-inside'>
                <li>
                  <strong>To Provide Our Services: </strong>
                  <span className={'text-muted-foreground'}>
                    To facilitate property swaps, manage user accounts, and
                    ensure the smooth operation of the platform.
                  </span>
                </li>
                <li>
                  <strong>To Improve Our Website and Services: </strong>
                  <span className={'text-muted-foreground'}>
                    To analyze user activity and optimize features, performance,
                    and content.
                  </span>
                </li>
                <li>
                  <strong>To Communicate with You: </strong>
                  <span className={'text-muted-foreground'}>
                    To send transaction-related notifications, marketing
                    communications (if opted-in), and customer support messages.
                  </span>
                </li>
                <li>
                  <strong>For Fraud Prevention and Security: </strong>
                  <span className={'text-muted-foreground'}>
                    To detect and prevent fraud, enhance security, and comply
                    with legal obligations.
                  </span>
                </li>
              </ol>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>Sharing Your Information</span>
              <p className={'text-sm text-muted-foreground'}>
                We respect your privacy and will not sell, rent, or trade your
                personal information. However, we may share your data in the
                following situations:
              </p>
              <ol className='space-y-1 ml-4 text-sm list-disc list-inside'>
                <li>
                  <strong>With Property Swap Participants: </strong>
                  <span className={'text-muted-foreground'}>
                    If you list a property for swapping, we will share relevant
                    property details with other users to facilitate the swap.
                  </span>
                </li>
                <li>
                  <strong>With Service Providers: </strong>
                  <span className={'text-muted-foreground'}>
                    We may share your data with trusted third-party companies
                    that provide services such as payment processing, hosting,
                    and analytics.
                  </span>
                </li>
                <li>
                  <strong>For Legal Compliance: </strong>
                  <span className={'text-muted-foreground'}>
                    If required by law or to protect our rights, we may disclose
                    your information to law enforcement or regulatory
                    authorities.
                  </span>
                </li>
              </ol>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>
                Cookies and Tracking Technologies
              </span>
              <p className={'text-sm text-muted-foreground'}>
                We use cookies and similar tracking technologies to:
              </p>
              <ol className='space-y-1 ml-4 text-sm list-disc list-inside'>
                <li>Remember your login credentials and preferences.</li>
                <li>Track your activity and improve the user experience.</li>
                <li>Deliver personalized content and advertisements.</li>
              </ol>
              <p className={'text-sm text-muted-foreground'}>
                You can manage cookie settings through your browser or device,
                but disabling cookies may limit some functionality of the
                website.
              </p>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>Data Security</span>
              <p className={'text-sm text-muted-foreground'}>
                We implement a range of security measures to protect your
                personal data, including encryption, secure servers, and regular
                monitoring of systems. However, no method of transmission or
                storage is 100% secure, so we cannot guarantee absolute
                protection against unauthorized access.
              </p>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>Your Rights</span>
              <p className={'text-sm text-muted-foreground'}>
                We use the information we collect for the following purposes:
              </p>
              <ol className='space-y-1 ml-4 text-sm list-disc list-inside'>
                <li>
                  <strong>Access: </strong>
                  <span className={'text-muted-foreground'}>
                    Request a copy of the personal information we hold about
                    you.
                  </span>
                </li>
                <li>
                  <strong>Correction: </strong>
                  <span className={'text-muted-foreground'}>
                    Request to correct any inaccurate or incomplete data.
                  </span>
                </li>
                <li>
                  <strong>Deletion: </strong>
                  <span className={'text-muted-foreground'}>
                    Request the deletion of your personal information, subject
                    to legal requirements.
                  </span>
                </li>
                <li>
                  <strong>Restriction: </strong>
                  <span className={'text-muted-foreground'}>
                    Request to restrict certain processing activities.
                  </span>
                </li>
                <li>
                  <strong>Objection: </strong>
                  <span className={'text-muted-foreground'}>
                    Object to the processing of your personal data for specific
                    purposes.
                  </span>
                </li>
              </ol>
              <p className={'text-sm text-muted-foreground'}>
                To exercise these rights, please contact us at [Insert Contact
                Email].
              </p>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>Third-Party Links</span>
              <p className={'text-sm text-muted-foreground'}>
                Our website may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. Please review their privacy policies before
                sharing any personal information with them.
              </p>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>Children&apos;s Privacy</span>
              <p className={'text-sm text-muted-foreground'}>
                Rotatekey does not knowingly collect or solicit personal
                information from individuals under the age of 18. If we discover
                that a child under 18 has provided us with personal information,
                we will delete that information immediately.
              </p>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>
                International Data Transfers
              </span>
              <p className={'text-sm text-muted-foreground'}>
                If you are accessing our services from outside the country where
                Rotatekey is located, your personal information may be
                transferred to, stored, and processed in other countries where
                we operate or where our service providers are located.
              </p>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>
                Updates to This Privacy Policy
              </span>
              <p className={'text-sm text-muted-foreground'}>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated revision date. We
                encourage you to review this policy periodically to stay
                informed about how we protect your data.
              </p>
            </li>

            <Separator />

            <li className={'space-y-2'}>
              <span className={'font-semibold'}>Contact Us</span>
              <p className={'text-sm text-muted-foreground'}>
                If you have any questions or concerns about this Privacy Policy
                or how we handle your personal data, please contact us at:
              </p>
              <ol className={'list-disc list-inside ml-4 space-y-1 text-sm'}>
                <li>Email: [Insert Contact Email]</li>
                <li>Phone: [Insert Phone Number]</li>
                <li>Mailing Address: [Insert Mailing Address]</li>
              </ol>
            </li>

            <Separator />
            <p className={'text-xs text-muted-foreground text-center'}>
              <abbr title={'End of Privacy Policy'}>
                *** By using our website and services, you consent to the terms
                outlined in this Privacy Policy.
              </abbr>
            </p>
          </ol>
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
