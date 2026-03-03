import { useState, type FormEvent } from 'react';
import { searchFiles, getDownloadUrl, type S3File } from '../api';
import { formatSize } from '../utils/formatSize';

export default function HomePage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<S3File[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const files = await searchFiles(query);
            setResults(files);
            setSearched(true);
        } catch (err) {
            console.error(err);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main id="main-content">
            <section className="usa-section">
                <div className="grid-container">
                    <div className="grid-row grid-gap flex-justify-center">
                        <div className="tablet:grid-col-8">
                            <h1 className="font-heading-xl margin-bottom-2">
                                Search Files
                            </h1>
                            <p className="usa-intro margin-bottom-4">
                                Search for files stored in Amazon S3.
                            </p>

                            {/* Search form */}
                            <form className="usa-search usa-search--big" role="search" onSubmit={handleSearch}>
                                <label className="usa-sr-only" htmlFor="search-field">
                                    Search
                                </label>
                                <input
                                    className="usa-input"
                                    id="search-field"
                                    type="search"
                                    name="search"
                                    placeholder="Enter file name..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button className="usa-button" type="submit" disabled={loading}>
                                    <span className={loading ? 'usa-sr-only' : ''}>Search</span>
                                    {loading && <span>Searching...</span>}
                                </button>
                            </form>

                            {/* Error */}
                            {error && (
                                <div className="usa-alert usa-alert--error usa-alert--slim margin-top-3" role="alert">
                                    <div className="usa-alert__body">
                                        <p className="usa-alert__text">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            {searched && !error && (
                                <div className="margin-top-4">
                                    <h2 className="font-heading-lg">
                                        {results.length} result{results.length !== 1 ? 's' : ''} found
                                    </h2>
                                    {results.length > 0 ? (
                                        <table className="usa-table usa-table--borderless width-full">
                                            <thead>
                                                <tr>
                                                    <th scope="col">File Name</th>
                                                    <th scope="col">Size</th>
                                                    <th scope="col">Last Modified</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.map((file) => (
                                                    <tr key={file.key}>
                                                        <td>{file.key}</td>
                                                        <td>{formatSize(file.size)}</td>
                                                        <td>{new Date(file.lastModified).toLocaleDateString()}</td>
                                                        <td>
                                                            <a
                                                                href={getDownloadUrl(file.key)}
                                                                className="usa-button usa-button--unstyled"
                                                                download
                                                            >
                                                                Download
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-base">No files match your search.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
