import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();

    return (
        <>
            {/* Official banner */}
            <div className="usa-banner">
                <div className="usa-accordion">
                    <header className="usa-banner__header">
                        <div className="usa-banner__inner">
                            <div className="grid-col-auto">
                                <img
                                    aria-hidden="true"
                                    className="usa-banner__header-flag"
                                    src="/uswds/img/us_flag_small.png"
                                    alt=""
                                />
                            </div>
                            <div className="grid-col-fill tablet:grid-col-auto" aria-hidden="true">
                                <p className="usa-banner__header-text">
                                    An official website of the United States government
                                </p>
                                <p className="usa-banner__header-action">Here's how you know</p>
                            </div>
                        </div>
                    </header>
                </div>
            </div>

            {/* Header */}
            <header className="usa-header usa-header--basic">
                <div className="usa-nav-container">
                    <div className="usa-navbar">
                        <div className="usa-logo">
                            <em className="usa-logo__text">
                                <Link to="/">S3 Search App</Link>
                            </em>
                        </div>
                        <button type="button" className="usa-menu-btn">Menu</button>
                    </div>
                    <nav aria-label="Primary navigation" className="usa-nav">
                        <button type="button" className="usa-nav__close">
                            <img src="/uswds/img/usa-icons/close.svg" role="img" alt="Close" />
                        </button>
                        <ul className="usa-nav__primary usa-accordion">
                            <li className="usa-nav__primary-item">
                                <Link
                                    to="/"
                                    className={`usa-nav-link ${location.pathname === '/' ? 'usa-current' : ''}`}
                                >
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li className="usa-nav__primary-item">
                                <Link
                                    to="/admin"
                                    className={`usa-nav-link ${location.pathname === '/admin' ? 'usa-current' : ''}`}
                                >
                                    <span>Admin</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
