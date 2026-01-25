import { useState } from 'react';
import { Group, Burger, Text, Button, Menu, UnstyledButton, Collapse, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconPlus, IconMinus } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './Header.module.css';
import { prefixPath } from '@/utils/path'; // Import helper

const menuItems = [
    { label: 'Forsiden', link: '/' },
    // ... existing menu definitions (unchanged)
    { label: 'Omtaler', link: '#' },
];

export function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (label: string) => {
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    const items = menuItems.map((item) => {
        if (item.links) {
            return (
                <Menu key={item.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <UnstyledButton className={classes.linkItem}>
                            <Text span fw={500} size="sm">{item.label}</Text>
                            <IconChevronDown size={14} className={classes.chevron} stroke={2} />
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {item.links.map((sublink) => (
                            <Menu.Item key={sublink.label} component={Link} href={sublink.link}>
                                {sublink.label}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={item.label} href={item.link} className={classes.linkItem}>
                <Text span fw={500} size="sm">{item.label}</Text>
            </Link>
        );
    });

    const mobileItems = menuItems.map((item) => {
        if (item.links) {
            const isOpen = activeDropdown === item.label;
            return (
                <div key={item.label}>
                    <UnstyledButton className={classes.mobileLink} onClick={() => toggleDropdown(item.label)}>
                        <Text fw={500} size="lg">{item.label}</Text>
                        {isOpen ? <IconMinus size={20} /> : <IconPlus size={20} />}
                    </UnstyledButton>
                    <Collapse in={isOpen}>
                        <div style={{ paddingLeft: 0, paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {item.links.map((sublink) => (
                                <Link key={sublink.label} href={sublink.link} onClick={close} style={{ textDecoration: 'none', color: '#555', fontSize: 16 }}>
                                    {sublink.label}
                                </Link>
                            ))}
                        </div>
                    </Collapse>
                </div>
            );
        }
        return (
            <Link key={item.label} href={item.link} className={classes.mobileLink} onClick={close}>
                <Text fw={500} size="lg">{item.label}</Text>
            </Link>
        );
    });

    return (
        <>
            <header className={classes.header}>
                <div className={classes.logo}>
                    {/* UPDATED: Path prefix for logo */}
                    <Image src={prefixPath('/meglerinnsikt_logo.png')} alt="Meglerinnsikt Logo" h={35} w="auto" fit="contain" />
                </div>

                <div className={classes.navLinks}>
                    {items}
                </div>

                <div className={classes.actions}>
                    <Group visibleFrom="md">
                        <Button variant="default" className={classes.btnSecondary} component="a" href="/kontakt">
                            Kontakt
                        </Button>
                        <Button className={classes.btnPrimary} component="a" href="/selge">
                            Selge bolig?
                        </Button>
                    </Group>

                    <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {opened && (
                <div className={classes.mobileOverlay}>
                    <div className={classes.mobileHeader}>
                        {/* UPDATED: Path prefix for logo */}
                        <Image src={prefixPath('/meglerinnsikt_logo.png')} alt="Meglerinnsikt Logo" h={35} w="auto" fit="contain" />
                        <Burger opened={opened} onClick={toggle} size="sm" />
                    </div>

                    <div className={classes.mobileMenu}>
                        {mobileItems}
                    </div>

                    <div className={classes.mobileActions}>
                        <Button variant="default" className={`${classes.btnSecondary} ${classes.mobileBtn}`} component="a" href="/kontakt">
                            Kontakt
                        </Button>
                        <Button className={`${classes.btnPrimary} ${classes.mobileBtn}`} component="a" href="/selge">
                            Selge bolig? →
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
