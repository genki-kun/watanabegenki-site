import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './post.module.css';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className={styles.main}>
            <article className={styles.article}>
                <Link href="/minitext" className={styles.back}>
                    ← MiniTextに戻る
                </Link>

                <header className={styles.header}>
                    <h1 className={styles.title}>{post.title}</h1>
                    <time className={styles.date}>
                        {new Date(post.date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </header>

                <div className={styles.content}>
                    {post.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? (
                            <p key={index}>{paragraph}</p>
                        ) : (
                            <br key={index} />
                        )
                    ))}
                </div>
            </article>
        </main>
    );
}
