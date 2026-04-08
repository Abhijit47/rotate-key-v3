// import { fetchPolarProducts } from '@/lib/actions';

import SimplePricing from '@/features/pricing/components/simple-pricing';

export default function PricingPage() {
  // const result = await fetchPolarProducts();
  // console.log('result', JSON.stringify(result.result.items, null, 2));
  return (
    <main>
      <SimplePricing />
    </main>
  );
}
