import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
    slug: string;
    title: string;
    date: string;
    content: string;
}

// Ensure posts directory exists
export function ensurePostsDirectory() {
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }
}

// Get all posts
export function getAllPosts(): Post[] {
    ensurePostsDirectory();

    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title || slug,
                date: data.date || new Date().toISOString(),
                content,
            };
        });

    // Sort posts by date (newest first)
    return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Get a single post by slug
export function getPostBySlug(slug: string): Post | null {
    ensurePostsDirectory();

    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        content,
    };
}

// Create or update a post
export async function savePost(slug: string, title: string, content: string): Promise<void> {
    // In production (Vercel), use GitHub API
    if (process.env.VERCEL || process.env.GITHUB_TOKEN) {
        const { createOrUpdateFile } = await import('./github');
        const date = new Date().toISOString();

        const fileContent = matter.stringify(content, {
            title,
            date,
        });

        const path = `content/posts/${slug}.md`;
        const message = `Update post: ${title}`;

        await createOrUpdateFile(path, fileContent, message);
    } else {
        // In development, use local filesystem
        ensurePostsDirectory();

        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const date = new Date().toISOString();

        const fileContent = matter.stringify(content, {
            title,
            date,
        });

        fs.writeFileSync(fullPath, fileContent, 'utf8');
    }
}

// Delete a post
export async function deletePost(slug: string): Promise<boolean> {
    // In production (Vercel), use GitHub API
    if (process.env.VERCEL || process.env.GITHUB_TOKEN) {
        const { deleteFile } = await import('./github');
        const path = `content/posts/${slug}.md`;
        const message = `Delete post: ${slug}`;

        try {
            await deleteFile(path, message);
            return true;
        } catch (error) {
            console.error('Error deleting post:', error);
            return false;
        }
    } else {
        // In development, use local filesystem
        const fullPath = path.join(postsDirectory, `${slug}.md`);

        if (!fs.existsSync(fullPath)) {
            return false;
        }

        fs.unlinkSync(fullPath);
        return true;
    }
}
