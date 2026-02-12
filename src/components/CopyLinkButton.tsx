'use client';

import { useState } from 'react';
import styles from './CopyLinkButton.module.css';

export default function CopyLinkButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`${styles.button} ${copied ? styles.copied : ''}`}
            aria-label="記事のリンクをコピー"
        >
            {copied ? (
                <>
                    <svg className={styles.icon} viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <svg className={styles.icon} viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                    <span>Copy Link</span>
                </>
            )}
        </button>
    );
}
