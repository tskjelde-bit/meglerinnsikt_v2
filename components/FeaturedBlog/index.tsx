import { Paper, Text, Overlay, Stack, Box, Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import classes from './FeaturedBlog.module.css';

export default function FeaturedBlog() {
    return (
        <Paper
            p="xl"
            shadow="sm"
            withBorder
            className={classes.card}
            h="100%"
            style={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden'
            }}
        >
            {/* Background Image for Zoom Effect */}
            <div
                className={classes.bgImage}
                style={{ backgroundImage: 'url(/featured_blog_bg_snow.jpg)' }}
            />

            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.85) 90%)"
                opacity={1}
                zIndex={1}
            />

            <Stack
                justify="flex-end"
                h="100%"
                gap="md" /* Increased spacing */
                style={{ position: 'relative', zIndex: 2 }}
            >
                <Box className={classes.content}>
                    <Text size="xs" tt="uppercase" fw={700} c="white" style={{ letterSpacing: '0.05em', opacity: 0.8 }}>
                        Markedsrapporter
                    </Text>
                    <Title />
                    <Text size="sm" c="white" mt={8} style={{ opacity: 0.9, lineHeight: 1.5 }} className={classes.description}>
                        I november falt boligprisene i Oslo 0,2 prosent nominelt, mens den sesongjusterte prisutviklingen endte på +0,7 prosent. Prisene har holdt seg bedre enn vanlig gjennom høsten, og aktiviteten i markedet er fortsatt høy.
                    </Text>

                    <Button
                        variant="filled"
                        color="brand-blue.5"
                        radius="xl"
                        size="md"
                        mt="lg"
                        rightSection={<IconArrowRight size={18} />}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        Les hele rapporten her
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
}

function Title() {
    return (
        <Text style={{ fontSize: '1.5rem', lineHeight: 1.2 }} fw={700} c="white">
            Markedsrapport Desember 2025
        </Text>
    );
}
