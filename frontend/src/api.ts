const API_BASE = '/api';

export interface S3File {
    key: string;
    size: number;
    lastModified: string;
}

/** Upload a file to S3 via backend */
export async function uploadFile(file: File): Promise<S3File> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/files`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
}

/** List all files in S3 */
export async function listFiles(): Promise<S3File[]> {
    const res = await fetch(`${API_BASE}/files`);
    if (!res.ok) throw new Error('Failed to list files');
    return res.json();
}

/** Search files by query */
export async function searchFiles(query: string): Promise<S3File[]> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
}

/** Delete a file from S3 */
export async function deleteFile(key: string): Promise<void> {
    const res = await fetch(`${API_BASE}/files/${encodeURIComponent(key)}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Delete failed');
}

/** Get download URL for a file */
export function getDownloadUrl(key: string): string {
    return `${API_BASE}/files/download/${encodeURIComponent(key)}`;
}
