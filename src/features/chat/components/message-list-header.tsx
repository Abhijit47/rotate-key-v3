import { Button } from '@/components/ui/button';

export default function MessageListHeader() {
  return (
    <div
      className={
        'h-16 bg-primary/30 backdrop-blur-lg rounded-bl-xl rounded-br-xl w-full flex items-center justify-center gap-2 px-2'
      }>
      {/* TODO: Will implement later */}
      <Button size={'xs'} className={'text-sm!'}>
        Do Somthing
      </Button>
      <Button size={'xs'} className={'text-sm!'}>
        Do Somthing
      </Button>
    </div>
  );
}
