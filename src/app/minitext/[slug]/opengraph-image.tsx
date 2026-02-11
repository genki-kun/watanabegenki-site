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

    // Fetch local Noto Sans JP Black font from public directory
    const fontUrl = new URL('/fonts/NotoSansJP-Black.woff2', 'https://watanabegenki-site.vercel.app');
    const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());

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
                    backgroundColor: 'white',
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
                            fontFamily: 'Noto Sans JP',
                            fontSize: 72,
                            fontWeight: 900,
                            color: 'black',
                            textAlign: 'center',
                            margin: 0,
                            lineHeight: 1.2,
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            fontSize: 32,
                            color: 'rgba(0,0,0,0.5)',
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
            fonts: [
                {
                    name: 'Noto Sans JP',
                    data: fontData,
                    weight: 900,
                    style: 'normal',
                },
            ],
        }
    );
}
