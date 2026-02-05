import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import styles from './minitext.module.css';

export default function MiniTextPage() {
    const posts = getAllPosts();

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>MiniText</h1>
                <p className={styles.subtitle}>短い文章、思考の断片</p>

                <div className={styles.grid}>
                    {posts.length === 0 ? (
                        <p className={styles.empty}>まだ記事がありません</p>
                    ) : (
                        posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/minitext/${post.slug}`}
                                className={styles.card}
                            >
                                <h2 className={styles.cardTitle}>{post.title}</h2>
                                <time className={styles.cardDate}>
                                    {new Date(post.date).toLocaleDateString('ja-JP', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                                <p className={styles.cardPreview}>
                                    {post.content.substring(0, 100)}
                                    {post.content.length > 100 ? '...' : ''}
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
