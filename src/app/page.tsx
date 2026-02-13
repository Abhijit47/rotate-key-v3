import LocaleToggler from '@/components/shared/locale-toggler';
import ThemeToggler from '@/components/shared/theme-toggler';
import TestJobs from '@/components/test-jobs';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className={'space-y-6'}>
      <div>
        <Button>Click me</Button>
        <ThemeToggler />
        <LocaleToggler />
      </div>

      <TestJobs />

      <div className={'space-y-5'}>
        <h1 className={'font-display text-7xl font-extrabold'}>
          {t(
            'hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text',
          )}
        </h1>
        <h1 className={'font-body text-7xl font-bold'}>
          {t(
            'hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text',
          )}
        </h1>
        <h1 className={'font-mono text-7xl font-bold'}>
          {t(
            'hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text',
          )}
        </h1>
      </div>
    </div>
  );
}
