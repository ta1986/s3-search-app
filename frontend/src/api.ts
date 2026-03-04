const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export interface S3File {
    key: string;
    size: number;
    lastModified: string;
}

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

export async function listFiles(): Promise<S3File[]> {
    const res = await fetch(`${API_BASE}/files`);
    if (!res.ok) throw new Error('Failed to list files');
    return res.json();
}

export async function deleteFile(key: string): Promise<void> {
    const res = await fetch(`${API_BASE}/files/${encodeURIComponent(key)}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Delete failed');
}
