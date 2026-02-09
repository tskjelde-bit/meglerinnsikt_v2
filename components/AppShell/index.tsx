import { AppShell } from '@mantine/core';
import { Header } from './Header';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="0" style={{ ['--app-shell-header-height' as any]: '64px' }}>
      <Header />
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
