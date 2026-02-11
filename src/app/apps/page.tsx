import ToolCard from '@/components/ToolCard';
import styles from './page.module.css';

export default function AppsPage() {
    const apps = [
        {
            name: 'AntiReality',
            tagline: 'Rendering Truth Fictional',
            description: 'AntiRealityは実際に撮った写真や非AI生成物にウォーターマークを付与することで真実性を歪めるアプリケーションです。',
            url: 'https://antireality.jp/',
            image: '/apps/antireality.png'
        }
    ];

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Apps</h1>

                <div className={styles.grid}>
                    {apps.map((app) => (
                        <ToolCard
                            key={app.name}
                            name={app.name}
                            tagline={app.tagline}
                            description={app.description}
                            url={app.url}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
