import { useEffect } from 'react';
import { Grid, Stack } from '@mantine/core';
import Chat from '@/components/Chat';
import Map from '@/components/Map';
import MarketInsight from '@/components/MarketInsight';
import { cssMainSize } from '@/theme';
import { useMap } from '@/context/Map';

import FeaturedBlog from '@/components/FeaturedBlog';

export default function HomePage() {
  // Animation logic is now handled internally by the Map component (Swarm effect)

  return (
    <Grid m="xl" h={cssMainSize} gutter="xl" columns={10} align="stretch">
      <Grid.Col span={{ base: 10, sm: 4 }} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-xl)' }}>
          <MarketInsight />
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <FeaturedBlog />
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 10, sm: 6 }} h="100%">
        <Map />
      </Grid.Col>
    </Grid>
  );
}
