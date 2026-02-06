'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

interface Post {
    slug: string;
    title: string;
    date: string;
    content: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState({
        slug: '',
        title: '',
        content: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // Store password in sessionStorage for API calls
                sessionStorage.setItem('adminPassword', password);
                setIsAuthenticated(true);
            } else {
                alert('パスワードが間違っています');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('ログインに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const handleSavePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const password = sessionStorage.getItem('adminPassword');
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch('/api/posts', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${password}`,
                },
                body: JSON.stringify(currentPost),
            });

            if (res.ok) {
                await fetchPosts();
                setCurrentPost({ slug: '', title: '', content: '' });
                setIsEditing(false);
            } else {
                alert('Failed to save post');
            }
        } catch (error) {
            console.error('Failed to save post:', error);
            alert('Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPost = (post: Post) => {
        setCurrentPost({
            slug: post.slug,
            title: post.title,
            content: post.content,
        });
        setIsEditing(true);
    };

    const handleDeletePost = async (slug: string) => {
        if (!confirm('本当に削除しますか?')) return;

        try {
            const password = sessionStorage.getItem('adminPassword');
            const res = await fetch(`/api/posts?slug=${slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${password}`,
                },
            });

            if (res.ok) {
                await fetchPosts();
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post');
        }
    };

    const handleNewPost = () => {
        setCurrentPost({ slug: '', title: '', content: '' });
        setIsEditing(false);
    };

    if (!isAuthenticated) {
        return (
            <main className={styles.main}>
                <div className={styles.loginContainer}>
                    <h1 className={styles.title}>Admin Login</h1>
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <input
                            type="password"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>CMS管理画面</h1>
                    <button onClick={handleNewPost} className={styles.newButton}>
                        新規記事
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.editor}>
                        <h2 className={styles.sectionTitle}>
                            {isEditing ? '記事を編集' : '新規記事'}
                        </h2>
                        <form onSubmit={handleSavePost} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>スラッグ (URL)</label>
                                <input
                                    type="text"
                                    value={currentPost.slug}
                                    onChange={(e) =>
                                        setCurrentPost({ ...currentPost, slug: e.target.value })
                                    }
                                    className={styles.input}
                                    placeholder="example-post"
                                    required
                                    disabled={isEditing}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>タイトル</label>
                                <input
                                    type="text"
                                    value={currentPost.title}
                                    onChange={(e) =>
                                        setCurrentPost({ ...currentPost, title: e.target.value })
                                    }
                                    className={styles.input}
                                    placeholder="記事のタイトル"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>本文</label>
                                <textarea
                                    value={currentPost.content}
                                    onChange={(e) =>
                                        setCurrentPost({ ...currentPost, content: e.target.value })
                                    }
                                    className={styles.textarea}
                                    placeholder="記事の本文を入力..."
                                    rows={15}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={loading}
                            >
                                {loading ? '保存中...' : '保存'}
                            </button>
                        </form>
                    </div>

                    <div className={styles.postsList}>
                        <h2 className={styles.sectionTitle}>記事一覧</h2>
                        {posts.length === 0 ? (
                            <p className={styles.empty}>記事がありません</p>
                        ) : (
                            <div className={styles.posts}>
                                {posts.map((post) => (
                                    <div key={post.slug} className={styles.postItem}>
                                        <div className={styles.postInfo}>
                                            <h3 className={styles.postTitle}>{post.title}</h3>
                                            <p className={styles.postSlug}>{post.slug}</p>
                                        </div>
                                        <div className={styles.postActions}>
                                            <button
                                                onClick={() => handleEditPost(post)}
                                                className={styles.editButton}
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => handleDeletePost(post.slug)}
                                                className={styles.deleteButton}
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
