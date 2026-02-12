import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CopyLinkButton from '@/components/CopyLinkButton';
import styles from './post.module.css';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Not Found',
        };
    }

    return {
        title: post.title,
        description: post.content.slice(0, 100).replace(/\n/g, ' ') + '...',
        openGraph: {
            title: post.title,
            description: post.content.slice(0, 100).replace(/\n/g, ' ') + '...',
            type: 'article',
            publishedTime: post.date,
            url: `https://watanabegenki.com/minitext/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.content.slice(0, 100).replace(/\n/g, ' ') + '...',
        },
    };
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
                    <div className={styles.meta}>
                        <time className={styles.date}>
                            {new Date(post.date).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                        <CopyLinkButton />
                    </div>
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
