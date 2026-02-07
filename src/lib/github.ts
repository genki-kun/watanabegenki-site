/**
 * GitHub API integration for CMS functionality
 * Enables file operations in Vercel's serverless environment
 */

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'genki-kun';
const GITHUB_REPO = process.env.GITHUB_REPO || 'watanabegenki-site';

interface GitHubFileResponse {
    sha: string;
    content: string;
}

/**
 * Get file from GitHub repository
 */
async function getFile(path: string): Promise<GitHubFileResponse | null> {
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not set');
    }

    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            sha: data.sha,
            content: data.content,
        };
    } catch (error) {
        console.error('Error getting file from GitHub:', error);
        throw error;
    }
}

/**
 * Create or update file in GitHub repository
 */
export async function createOrUpdateFile(
    path: string,
    content: string,
    message: string
): Promise<void> {
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not set');
    }

    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    // Get existing file SHA if it exists
    const existingFile = await getFile(path);

    // Encode content to base64
    const encodedContent = Buffer.from(content).toString('base64');

    const body: any = {
        message,
        content: encodedContent,
    };

    // If file exists, include SHA for update
    if (existingFile) {
        body.sha = existingFile.sha;
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${errorData.message || response.statusText}`);
        }

        // Trigger deployment after successful update
        await triggerDeploy();
    } catch (error) {
        console.error('Error creating/updating file on GitHub:', error);
        throw error;
    }
}

/**
 * Trigger Vercel deploy hook
 */
async function triggerDeploy(): Promise<void> {
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

    if (!deployHookUrl) {
        console.log('No VERCEL_DEPLOY_HOOK_URL set, skipping auto-deploy');
        return;
    }

    try {
        console.log('Triggering Vercel deployment...');
        const response = await fetch(deployHookUrl, {
            method: 'POST',
        });

        if (response.ok) {
            console.log('Deployment triggered successfully');
        } else {
            console.error('Failed to trigger deployment:', response.statusText);
        }
    } catch (error) {
        console.error('Error triggering deployment:', error);
    }
}

/**
 * Delete file from GitHub repository
 */
export async function deleteFile(path: string, message: string): Promise<void> {
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not set');
    }

    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    // Get file SHA (required for deletion)
    const existingFile = await getFile(path);

    if (!existingFile) {
        throw new Error('File not found');
    }

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                sha: existingFile.sha,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${errorData.message || response.statusText}`);
        }

        // Trigger deployment after successful deletion
        await triggerDeploy();
    } catch (error) {
        console.error('Error deleting file from GitHub:', error);
        throw error;
    }
}
