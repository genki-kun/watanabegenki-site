import ToolCard from '@/components/ToolCard';
import styles from './page.module.css';

export default function ToolsPage() {
    const tools = [
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
                <h1 className={styles.title}>Tools</h1>
                <p className={styles.subtitle}>個人開発したツール</p>
                <div className={styles.grid}>
                    {tools.map((tool) => (
                        <ToolCard
                            key={tool.name}
                            name={tool.name}
                            tagline={tool.tagline}
                            description={tool.description}
                            url={tool.url}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
