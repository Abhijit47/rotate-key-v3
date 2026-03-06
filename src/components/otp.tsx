import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';

export default function OTPForm() {
  return (
    <div>
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='checkout-7j9-card-name-43j'>
                  Name on Card
                </FieldLabel>
                <Input
                  id='checkout-7j9-card-name-43j'
                  placeholder='Evil Rabbit'
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type='submit' className={'mt-4'}>
            Pay $100
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
