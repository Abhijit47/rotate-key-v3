import { ThemeToggler } from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
      <ThemeToggler />

      <div className={'space-y-5'}>
        <h1 className={'font-display text-7xl font-extrabold'}>
          Hello world! This is a test of the new font loading system. Thefont
          should load without any issues, and there should be no flashes of
          unstyled text.
        </h1>
        <h1 className={'font-body text-7xl font-bold'}>
          Hello world! This is a test of the new font loading system. Thefont
          should load without any issues, and there should be no flashes of
          unstyled text.
        </h1>
        <h1 className={'font-mono text-7xl font-bold'}>
          Hello world! This is a test of the new font loading system. Thefont
          should load without any issues, and there should be no flashes of
          unstyled text.
        </h1>
      </div>
    </div>
  );
}
