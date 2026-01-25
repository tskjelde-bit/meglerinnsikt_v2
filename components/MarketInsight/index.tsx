import { Paper, Title, Text, Stack, ThemeIcon, Group, Badge, RingProgress, Center, Box, Image } from '@mantine/core';
import { useMap } from '@/context/Map';
import { IconHomeStats, IconTrendingUp, IconClock, IconMapPin } from '@tabler/icons-react';

// Real estate data for Oslo districts (Approximate realistic values)
const getMockData = (district: string) => {
    const db: Record<string, { priceChange: number; turnover: number; medianPrice: number; sqPrice: number; description?: string }> = {
        'Hele Oslo': { priceChange: 2.8, turnover: 22, medianPrice: 6200000, sqPrice: 92000, description: "Hovedstaden er preget av høy etterspørsel og moderat prisvekst." },
        'Frogner': { priceChange: 1.5, turnover: 25, medianPrice: 8500000, sqPrice: 125000, description: "Eksklusivt område med historiske bygårder og høy kvadratmeterpris." },
        'Grünerløkka': { priceChange: 3.2, turnover: 16, medianPrice: 5800000, sqPrice: 105000, description: "Urbant og livlig, populært blant unge voksne og småbarnsfamilier." },
        'St. Hanshaugen': { priceChange: 2.9, turnover: 18, medianPrice: 6500000, sqPrice: 112000, description: "Sentrumsnært med flotte parkområder og klassisk arkitektur." },
        'Sagene': { priceChange: 3.5, turnover: 14, medianPrice: 5400000, sqPrice: 108000, description: "Sjarmerende arbeiderstrøk som har blitt svært attraktivt." },
        'Gamle Oslo': { priceChange: 4.1, turnover: 15, medianPrice: 5100000, sqPrice: 102000, description: "Område i rask utvikling, nær Bjørvika og Sørenga." },
        'Nordstrand': { priceChange: 2.2, turnover: 35, medianPrice: 9200000, sqPrice: 85000, description: "Familievennlig med fjordutsikt, villabebyggelse og store hager." },
        'Nordre Aker': { priceChange: 2.5, turnover: 28, medianPrice: 8800000, sqPrice: 94000, description: "Porten til marka, populært for aktive familier og studenter." },
        'Vestre Aker': { priceChange: 1.8, turnover: 32, medianPrice: 10500000, sqPrice: 98000, description: "Etablert villaområde med nærhet til både by og natur." },
        'Ullern': { priceChange: 1.6, turnover: 30, medianPrice: 11200000, sqPrice: 100000, description: "Preget av store eneboliger og rolig atmosfære." },
        'Østensjø': { priceChange: 3.8, turnover: 20, medianPrice: 5900000, sqPrice: 78000, description: "Nærhet til Østensjøvannet og gode kollektivforbindelser." },
        'Alna': { priceChange: 5.2, turnover: 19, medianPrice: 4800000, sqPrice: 65000, description: "Stor variasjon i boligtyper og rimeligere inngangspriser." },
        'Bjerke': { priceChange: 4.5, turnover: 21, medianPrice: 5300000, sqPrice: 72000, description: "Utviklingsområde med god tilgang til både by og grøntområder." },
        'Grorud': { priceChange: 5.8, turnover: 24, medianPrice: 4200000, sqPrice: 58000, description: "Naturskjønt med Lillomarka som nærmeste nabo." },
        'Stovner': { priceChange: 6.1, turnover: 26, medianPrice: 3900000, sqPrice: 52000, description: "Høyest prisvekst det siste året, mye bolig for pengene." },
        'Søndre Nordstrand': { priceChange: 4.9, turnover: 29, medianPrice: 4100000, sqPrice: 54000, description: "Fjordnært og rolig, med mangfoldig bebyggelse." },
    };

    return db[district] || {
        // Fallback randomizer closely mimics "Hele Oslo" average
        priceChange: 2.5 + (Math.random() * 1),
        turnover: 20 + Math.floor(Math.random() * 10),
        medianPrice: 6000000 + Math.floor(Math.random() * 1000000),
        sqPrice: 90000 + Math.floor(Math.random() * 10000),
        description: "Et populært område med variert bebyggelse."
    };
};

export default function MarketInsight() {
    const { selectedDistrict } = useMap();

    const viewDistrict = selectedDistrict || 'Hele Oslo';
    const data = getMockData(viewDistrict);
    const formatPrice = (price: number) => new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumSignificantDigits: 9, maximumFractionDigits: 0 }).format(price);

    return (
        <Paper p="md" shadow="sm" withBorder>
            <Stack gap="md">
                <Box>
                    <Group justify="space-between" align="center" mb={4}>
                        <Title order={3}>Markedsinnsikt {viewDistrict}</Title>
                    </Group>
                    <Text size="sm" c="dimmed" lh={1.3}>
                        {data.description || "Populært blant barnefamilier og studenter, med kort vei til marka."}
                    </Text>
                </Box>

                <Group justify="space-between" bg="gray.0" p="sm" style={{ borderRadius: 8 }}>
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Prisendring hittil i år</Text>
                    <Text fw={700} size="lg" c={data.priceChange >= 0 ? 'green.7' : 'red.7'}>
                        {data.priceChange > 0 ? '+' : ''}{data.priceChange.toFixed(1)}%
                    </Text>
                </Group>

                <Stack gap="lg">
                    <Group>
                        <ThemeIcon variant="light" color="orange" size="xl" radius="md"><IconClock size={24} /></ThemeIcon>
                        <div>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: '0.05em' }}>Omsetningshastighet</Text>
                            <Text fw={700} size="xl" style={{ lineHeight: 1 }}>{data.turnover} dager</Text>
                        </div>
                    </Group>

                    <Group>
                        <ThemeIcon variant="light" color="blue" size="xl" radius="md"><IconHomeStats size={24} /></ThemeIcon>
                        <div>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: '0.05em' }}>Medianpris</Text>
                            <Text fw={700} size="xl" style={{ lineHeight: 1 }}>{formatPrice(data.medianPrice)}</Text>
                        </div>
                    </Group>

                    <Group>
                        <ThemeIcon variant="light" color="teal" size="xl" radius="md"><IconTrendingUp size={24} /></ThemeIcon>
                        <div>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: '0.05em' }}>Kvadratmeterpris</Text>
                            <Text fw={700} size="xl" style={{ lineHeight: 1 }}>{formatPrice(data.sqPrice)}</Text>
                        </div>
                    </Group>
                </Stack>
            </Stack>
        </Paper>
    );
}
