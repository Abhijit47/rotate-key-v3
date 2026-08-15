import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyContext } from '@/contexts/property-context';

export default function PropertyFormHeader() {
  const { currentStepDetails } = usePropertyContext();

  return (
    <CardHeader>
      <CardTitle>{currentStepDetails.title}</CardTitle>
      <CardDescription>{currentStepDetails.description}</CardDescription>
    </CardHeader>
  );
}
