import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = 'MiniText Article';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Fetch post title from GitHub API for production
async function getPostTitle(slug: string): Promise<string> {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'genki-kun';
    const GITHUB_REPO = process.env.GITHUB_REPO || 'watanabegenki-site';

    if (!GITHUB_TOKEN) {
        console.log('No GITHUB_TOKEN, returning fallback title');
        return 'MiniText';
    }

    const path = `content/posts/${slug}.md`;
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            console.log(`Failed to fetch post: ${response.status}`);
            return 'MiniText';
        }

        const data = await response.json();
        const content = Buffer.from(data.content, 'base64').toString('utf8');

        // Parse front-matter to get title
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
            const frontMatter = match[1];
            const titleLine = frontMatter.split('\n').find(line => line.startsWith('title:'));
            if (titleLine) {
                // Remove 'title:' prefix and any quotes
                let title = titleLine.replace(/^title:\s*/, '').trim();
                title = title.replace(/^['"]|['"]$/g, '');
                return title;
            }
        }

        return 'MiniText';
    } catch (error) {
        console.error('Error fetching post title:', error);
        return 'MiniText';
    }
}

export default async function Image({ params }: { params: { slug: string } }) {
    const title = await getPostTitle(params.slug);

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f7',
                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px',
                        maxWidth: '80%',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            margin: 0,
                            lineHeight: 1.2,
                            textShadow: '2px 2px 10px rgba(0,0,0,0.3)',
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            fontSize: 32,
                            color: 'rgba(255,255,255,0.8)',
                            marginTop: 30,
                        }}
                    >
                        MiniText
                    </p>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
