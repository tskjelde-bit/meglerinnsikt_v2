
import React from 'react';
import { Card, Title, Stack, Text, Group, ThemeIcon, Box, Badge } from '@mantine/core';
import { IconClock, IconHome, IconChartBar } from '@tabler/icons-react';
import { useMap } from '@/context/Map';

// Mock Data Database (Move this to a shared util if needed later)
const getDistrictData = (district: string | null) => {
    const defaultData = {
        name: 'Markedsinnsikt Hele Oslo',
        description: 'Hovedstaden er preget av høy etterspørsel og moderat prisvekst.',
        priceChange: 2.8,
        turnover: 22,
        medianPrice: 6200000,
        sqPrice: 92000,
    };

    if (!district) return defaultData;

    const db: Record<string, { priceChange: number; turnover: number; medianPrice: number; sqPrice: number }> = {
        'Frogner': { priceChange: 1.5, turnover: 25, medianPrice: 8500000, sqPrice: 125000 },
        'Grünerløkka': { priceChange: 3.2, turnover: 16, medianPrice: 5800000, sqPrice: 105000 },
        'St. Hanshaugen': { priceChange: 2.9, turnover: 18, medianPrice: 6500000, sqPrice: 112000 },
        'Sagene': { priceChange: 3.5, turnover: 14, medianPrice: 5400000, sqPrice: 108000 },
        'Gamle Oslo': { priceChange: 4.1, turnover: 15, medianPrice: 5100000, sqPrice: 102000 },
        'Nordstrand': { priceChange: 2.2, turnover: 35, medianPrice: 9200000, sqPrice: 85000 },
        'Nordre Aker': { priceChange: 2.5, turnover: 28, medianPrice: 8800000, sqPrice: 94000 },
        'Vestre Aker': { priceChange: 1.8, turnover: 32, medianPrice: 10500000, sqPrice: 98000 },
        'Ullern': { priceChange: 1.6, turnover: 30, medianPrice: 11200000, sqPrice: 100000 },
        'Østensjø': { priceChange: 3.8, turnover: 20, medianPrice: 5900000, sqPrice: 78000 },
        'Alna': { priceChange: 5.2, turnover: 19, medianPrice: 4800000, sqPrice: 65000 },
        'Bjerke': { priceChange: 4.5, turnover: 21, medianPrice: 5300000, sqPrice: 72000 },
        'Grorud': { priceChange: 5.8, turnover: 24, medianPrice: 4200000, sqPrice: 58000 },
        'Stovner': { priceChange: 6.1, turnover: 26, medianPrice: 3900000, sqPrice: 52000 },
        'Søndre Nordstrand': { priceChange: 4.9, turnover: 29, medianPrice: 4100000, sqPrice: 54000 },
    };

    const data = db[district];
    if (!data) return defaultData;

    return {
        name: `Markedsinnsikt ${district}`,
        description: `${district} er et attraktivt område med variert bebyggelse.`, // Generic placeholders
        ...data
    };
};


const MarketInsight = () => {
    const { selectedDistrict } = useMap();
    const data = getDistrictData(selectedDistrict);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(price).replace('kr', 'kr');

    return (
        <Card
            radius="md"
            p="xl"
            withBorder
            style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: '#1e293b', // darker text like screenshot
                // height: '100%', // REMOVED: This was pushing the blog post out of view
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header Section */}
            <Stack gap={4} mb="lg">
                <Title order={3} fw={700} style={{ color: '#0f172a' }}>
                    {data.name}
                </Title>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.4 }}>
                    {data.description}
                </Text>
            </Stack>

            {/* Feature Row: Price Change */}
            <Box
                p="sm"
                mb="lg"
                style={{
                    backgroundColor: '#F8FAFC', // Very light grey bg
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Text size="xs" fw={700} tt="uppercase" c="gray.6" style={{ letterSpacing: '0.05em' }}>
                    Prisendring hittil i år
                </Text>
                <Text size="md" fw={700} c="green.6">
                    +{data.priceChange.toFixed(1)}%
                </Text>
            </Box>

            {/* Data Grid */}
            <Stack gap="xl">
                {/* Turnover */}
                <Group align="flex-start" wrap="nowrap">
                    <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                        <IconClock size={20} stroke={1.5} />
                    </ThemeIcon>
                    <Box>
                        <Text size="xs" fw={700} tt="uppercase" c="gray.5" mb={2}>
                            Omsetningshastighet
                        </Text>
                        <Title order={4} fw={700} style={{ color: '#1e293b' }}>
                            {data.turnover} dager
                        </Title>
                    </Box>
                </Group>

                {/* Median Price */}
                <Group align="flex-start" wrap="nowrap">
                    <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                        <IconHome size={20} stroke={1.5} />
                    </ThemeIcon>
                    <Box>
                        <Text size="xs" fw={700} tt="uppercase" c="gray.5" mb={2}>
                            Medianpris
                        </Text>
                        <Title order={4} fw={700} style={{ color: '#1e293b' }}>
                            {formatPrice(data.medianPrice)}
                        </Title>
                    </Box>
                </Group>

                {/* Sq Meter Price */}
                <Group align="flex-start" wrap="nowrap">
                    <ThemeIcon variant="light" color="green" size="lg" radius="md">
                        <IconChartBar size={20} stroke={1.5} />
                    </ThemeIcon>
                    <Box>
                        <Text size="xs" fw={700} tt="uppercase" c="gray.5" mb={2}>
                            Kvadratmeterpris
                        </Text>
                        <Title order={4} fw={700} style={{ color: '#1e293b' }}>
                            {data.sqPrice.toLocaleString('no-NO')} kr
                        </Title>
                    </Box>
                </Group>
            </Stack>
        </Card>
    );
};

export default MarketInsight;
