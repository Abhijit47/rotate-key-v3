import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/my-profile/components/app-sidebar';
import { SiteHeader } from '@/features/my-profile/components/site-header';

export default function MyProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }>
      <AppSidebar variant='floating' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col border-l'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
