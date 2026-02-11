import ToolCard from '@/components/ToolCard';
import styles from './page.module.css';

export default function AppsPage() {
    const apps = [
        {
            name: 'AntiReality',
            tagline: 'Rendering Truth Fictional',
            description: '写真を非現実的なビジュアルに変換する画像加工ツール。真実をフィクションのように見せる独自の加工技術を提供します。',
            url: 'https://antireality.jp/'
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
