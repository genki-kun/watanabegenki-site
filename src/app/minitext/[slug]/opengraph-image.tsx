import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';

export const alt = 'MiniText Article';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const title = post?.title || 'MiniText';

    console.log(`[OGP] Generating image for slug: ${slug}, title: ${title}`);

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
