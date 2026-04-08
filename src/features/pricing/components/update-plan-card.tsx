import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

export default function UpdatePlanCard() {
  return (
    <Card className={'max-w-lg mx-auto'}>
      <CardHeader>
        <CardTitle>Upgrade Plan</CardTitle>
        <CardDescription>
          You are currently on the Free plan. Upgrade to Pro for more features.
        </CardDescription>

        <CardAction className={'flex flex-wrap gap-2'}>
          <Button variant={'outline'}>Monthly</Button>
          <Button variant={'default'}>Yearly</Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <RadioGroup defaultValue='plus' className='w-full'>
          <FieldLabel htmlFor='plus-plan'>
            <Field orientation='horizontal'>
              <FieldContent>
                <FieldTitle>Plus</FieldTitle>
                <FieldDescription>
                  For individuals and small teams.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value='plus' id='plus-plan' />
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor='pro-plan'>
            <Field orientation='horizontal'>
              <FieldContent>
                <FieldTitle>Pro</FieldTitle>
                <FieldDescription>For growing businesses.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value='pro' id='pro-plan' />
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor='enterprise-plan'>
            <Field orientation='horizontal'>
              <FieldContent>
                <FieldTitle>Enterprise</FieldTitle>
                <FieldDescription>
                  For large teams and enterprises.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value='enterprise' id='enterprise-plan' />
            </Field>
          </FieldLabel>
        </RadioGroup>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
