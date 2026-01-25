import { createTheme } from '@mantine/core';

export const theme = createTheme({
    fontFamily: 'Inter, sans-serif',
    headings: {
        fontFamily: 'Barlow, sans-serif',
        // Default weights for headings can be handled here or in specific components
        sizes: {
            h1: { fontSize: '3rem', fontWeight: '700', lineHeight: '1.1' }, // 48px
            h2: { fontSize: '2.25rem', fontWeight: '700', lineHeight: '1.2' }, // 36px
            h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.3' }, // 24px
            h4: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.4' }, // 20px
            h5: { fontSize: '0.875rem', fontWeight: '700', lineHeight: '1.5' }, // 14px
        },
    },
    colors: {
        // Defining Semantic Colors
        // Primary Blue: #3B82F6 (Tailwind Blue 500)
        'brand-blue': ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'],
        // Slate (Text): #64748B, #334155, #0F172A
        'brand-slate': ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A'],
    },
    primaryColor: 'brand-blue',
    primaryShade: 5, // #3B82F6
    defaultRadius: 'md', // 8px (approx)
    components: {
        Text: {
            defaultProps: {
                c: 'brand-slate.7' // Default body text color #334155
            }
        },
        Title: {
            defaultProps: {
                c: 'brand-slate.9' // Default heading color #0F172A (mostly)
            }
        }
    }
});

export const cssMainSize = 'calc(100vh - var(--app-shell-header-height) - 64px)';
export const cssHalfMainSize = `calc(${cssMainSize} / 2)`;
