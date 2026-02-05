'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: '/minitext', label: 'MiniText' },
        { href: '/tools', label: 'Tools' },
        { href: '/shop', label: 'Shop' },
    ];

    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>
                Genki Watanabe
            </Link>
            <div className={styles.links}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
