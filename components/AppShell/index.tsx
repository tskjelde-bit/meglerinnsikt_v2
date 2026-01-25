import { ActionIcon, AppShell, Group, Title, Image, Text } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import Link from 'next/link';
import ColorSchemeToggle from '../ColorSchemeToggle/ColorSchemeToggle';
import classes from './AppShell.module.css';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 90 }} padding="0">
      <AppShell.Header>
        <Group h="100%" px="xl">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group wrap="nowrap" style={{ cursor: 'pointer' }}>
              <Image src="/meglerinnsikt_logo.png" alt="Meglerinnsikt Logo" h={45} w="auto" fit="contain" />
            </Group>

            {/* Navigation Menu */}
            <Group gap="xl" visibleFrom="sm">
              {['FORSIDEN', 'MARKEDSRAPPORTER', 'INNSIKT', 'TIPS & TRIKS', 'OM', 'OMTALER', 'KONTAKT'].map((item) => (
                <Text
                  key={item}
                  className={classes.navLink}
                  size="xs"
                  fw={700}
                >
                  {item}
                </Text>
              ))}
            </Group>
            <Group ml="xl" gap="lg">
              <Link
                href="https://github.com/ACHultman/Wanderlust"
                rel="no-referrer noopener"
                target="_blank"
              >
                <ActionIcon variant="default" color="gray" size="xl" radius="md">
                  <IconBrandGithub />
                </ActionIcon>
              </Link>
              <ColorSchemeToggle />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell >
  );
}
