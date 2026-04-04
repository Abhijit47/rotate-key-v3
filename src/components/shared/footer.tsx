export default function Footer() {
  return (
    <footer>
      <div
        className={
          'py-4 px-4 w-full bg-accent border-t border-accent-foreground/10 dark:bg-accent/50 dark:border-accent-foreground/20 text-center'
        }>
        <p className={'text-sm text-muted-foreground'}>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
