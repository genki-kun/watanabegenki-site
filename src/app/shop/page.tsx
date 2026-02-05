import styles from './shop.module.css';

export default function ShopPage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Shop</h1>
                <p className={styles.subtitle}>Coming Soon</p>

                <div className={styles.content}>
                    <p>このセクションは現在準備中です。</p>
                </div>
            </div>
        </main>
    );
}
