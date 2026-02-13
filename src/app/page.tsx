import { ThemeToggler } from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/drizzle/db';

export default async function Home() {
  const posts = await db.query.postsTable.findMany();

  return (
    <div>
      <Button>Click me</Button>
      <ThemeToggler />

      <div className={'grid grid-cols-2 gap-6'}>
        {posts.map((post) => (
          <Card key={post.id}>
            <div>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
          </Card>
        ))}
      </div>

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
