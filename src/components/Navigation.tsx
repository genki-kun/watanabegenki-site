'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: '/minitext', label: 'MiniText' },
        { href: '/apps', label: 'Apps' },
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
            <div className={styles.socialSubHeader}>
                <a
                    href="https://x.com/ashley_hegy_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                >
                    Twitter
                </a>
                <span className={styles.separator}>/</span>
                <a
                    href="https://www.instagram.com/genkl_kun_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                >
                    Instagram
                </a>
            </div>
        </nav>
    );
}
