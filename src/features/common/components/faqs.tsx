import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/constants';

export default function Faqs() {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={`item-${faq.id}`}>
          <AccordionTrigger
            className={
              'text-foreground font-medium text-sm md:text-base lg:text-lg'
            }>
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className={'text-muted-foreground p-3'}>
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
