import { useState, useEffect, useRef, useCallback } from 'react';
import {
    listFiles,
    uploadFile,
    deleteFile,
    getDownloadUrl,
    type S3File,
} from '../api';
import { formatSize } from '../utils/formatSize';

export default function AdminPage() {
    const [files, setFiles] = useState<S3File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listFiles();
            setFiles(data);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load files.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleUpload = async () => {
        const input = fileInputRef.current;
        if (!input?.files?.length) {
            setMessage({ type: 'error', text: 'Please select a file first.' });
            return;
        }

        setUploading(true);
        setMessage(null);
        try {
            for (const file of Array.from(input.files)) {
                await uploadFile(file);
            }
            setMessage({ type: 'success', text: 'File(s) uploaded successfully!' });
            input.value = '';
            await fetchFiles();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (key: string) => {
        if (!window.confirm(`Delete "${key}"?`)) return;
        try {
            await deleteFile(key);
            setMessage({ type: 'success', text: `Deleted "${key}".` });
            await fetchFiles();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Delete failed.' });
        }
    };

    return (
        <main id="main-content">
            <section className="usa-section">
                <div className="grid-container">
                    <h1 className="font-heading-xl margin-bottom-4">File Management</h1>

                    {/* Alert messages */}
                    {message && (
                        <div
                            className={`usa-alert usa-alert--${message.type === 'success' ? 'success' : 'error'} usa-alert--slim margin-bottom-3`}
                            role="alert"
                        >
                            <div className="usa-alert__body">
                                <p className="usa-alert__text">{message.text}</p>
                            </div>
                        </div>
                    )}

                    {/* Upload area */}
                    <div className="usa-card margin-bottom-4">
                        <div className="usa-card__container">
                            <div className="usa-card__header">
                                <h2 className="usa-card__heading">Upload Files</h2>
                            </div>
                            <div className="usa-card__body">
                                <label className="usa-label" htmlFor="file-input">
                                    Select file(s) to upload
                                </label>
                                <input
                                    id="file-input"
                                    ref={fileInputRef}
                                    className="usa-file-input"
                                    type="file"
                                    multiple
                                    disabled={uploading}
                                />
                            </div>
                            <div className="usa-card__footer">
                                <button
                                    className="usa-button"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* File list */}
                    <h2 className="font-heading-lg margin-bottom-2">Stored Files</h2>
                    {loading ? (
                        <p>Loading files...</p>
                    ) : files.length === 0 ? (
                        <p className="text-base">No files uploaded yet.</p>
                    ) : (
                        <table className="usa-table usa-table--borderless width-full">
                            <thead>
                                <tr>
                                    <th scope="col">File Name</th>
                                    <th scope="col">Size</th>
                                    <th scope="col">Last Modified</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((file) => (
                                    <tr key={file.key}>
                                        <td>{file.key}</td>
                                        <td>{formatSize(file.size)}</td>
                                        <td>{new Date(file.lastModified).toLocaleDateString()}</td>
                                        <td>
                                            <a
                                                href={getDownloadUrl(file.key)}
                                                className="usa-button usa-button--outline usa-button--unstyled margin-right-2"
                                                download
                                            >
                                                Download
                                            </a>
                                            <button
                                                className="usa-button usa-button--secondary usa-button--unstyled text-secondary"
                                                onClick={() => handleDelete(file.key)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </main>
    );
}
