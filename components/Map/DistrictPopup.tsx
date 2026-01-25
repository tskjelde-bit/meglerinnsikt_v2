
import { Text, Stack, Group, Box, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

// Real estate data for Oslo districts
const getMockData = (district: string | null) => {
    const defaultData = {
        priceChange: 2.8,
        turnover: 22,
        medianPrice: 6200000,
        sqPrice: 92000,
    };

    if (!district) return defaultData;

    const db: Record<string, { priceChange: number; turnover: number; medianPrice: number; sqPrice: number }> = {
        'Hele Oslo': defaultData,
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

    return db[district] || defaultData;
};

interface DistrictPopupProps {
    district: string;
    onClose?: () => void;
}

export function DistrictPopup({ district, onClose }: DistrictPopupProps) {
    const data = getMockData(district);

    // Formatters
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(price);

    // Brand Colors
    const brandBlue = '#2F8CFF';
    const labelColor = '#1e293b'; // Dark Slate
    const valueGreen = '#22c55e'; // Green 500

    // Row Helper for strict alignment
    const Row = ({ label, value, valueColor = brandBlue }: { label: string, value: React.ReactNode, valueColor?: string }) => (
        <Group justify="space-between" align="center" style={{ width: '100%' }}>
            <Text size="xs" fw={800} tt="uppercase" c={labelColor} style={{ letterSpacing: '0.02em' }}>
                {label}
            </Text>
            <Text size="sm" fw={800} style={{ color: valueColor }}>
                {value}
            </Text>
        </Group>
    );

    return (
        <Box style={{
            position: 'relative',
            minWidth: 280,
            padding: 16,
            paddingTop: 24, // Extra top padding for close button space ?? Or put it parallel?
            backgroundColor: 'white',
            borderRadius: '1.5rem', // Matches the map label style
            border: `3px solid ${brandBlue}`, // Thick blue border from screenshot
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            {/* Custom Close Button */}
            {onClose && (
                <ActionIcon
                    onClick={onClose}
                    variant="transparent"
                    size="sm"
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: labelColor,
                        zIndex: 10
                    }}
                >
                    <IconX size={16} stroke={3} />
                </ActionIcon>
            )}

            <Stack gap={10}>
                <Row
                    label="Prisvekst"
                    value={`${data.priceChange > 0 ? '+' : ''}${data.priceChange.toFixed(1)}%`}
                    valueColor={valueGreen}
                />
                <Row
                    label="Omsetning"
                    value={`${data.turnover} DAGER`}
                />
                <Row
                    label="Medianpris"
                    value={formatPrice(data.medianPrice).replace('kr', 'KR')}
                />
                <Row
                    label="Kvadratmeter"
                    value={data.sqPrice.toLocaleString('no-NO')}
                />
            </Stack>
        </Box>
    );
}

export default DistrictPopup;
