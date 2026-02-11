import Image from 'next/image';
import Link from 'next/link';
import styles from './ToolCard.module.css';

interface ToolCardProps {
    name: string;
    tagline: string;
    description: string;
    url: string;
    image?: string;
}

export default function ToolCard({ name, tagline, description, url, image }: ToolCardProps) {
    return (
        <Link href={url} target="_blank" rel="noopener noreferrer" className={styles.card}>
            {image && (
                <div className={styles.imageWrapper}>
                    <Image
                        src={image}
                        alt={`${name} cover`}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}
            <div className={styles.content}>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.tagline}>{tagline}</p>
                <p className={styles.description}>{description}</p>
                <div className={styles.linkIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
