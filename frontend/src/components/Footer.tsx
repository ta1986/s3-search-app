import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="usa-footer usa-footer--slim">
            <div className="usa-footer__primary-section">
                <div className="usa-footer__primary-container grid-row">
                    <div className="mobile-lg:grid-col-8">
                        <nav className="usa-footer__nav" aria-label="Footer navigation">
                            <ul className="grid-row grid-gap">
                                <li className="mobile-lg:grid-col-6 desktop:grid-col-auto usa-footer__primary-content">
                                    <Link className="usa-footer__primary-link" to="/">
                                        Home
                                    </Link>
                                </li>
                                <li className="mobile-lg:grid-col-6 desktop:grid-col-auto usa-footer__primary-content">
                                    <Link className="usa-footer__primary-link" to="/admin">
                                        Admin
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="usa-footer__secondary-section">
                <div className="grid-container">
                    <div className="usa-footer__logo grid-row grid-gap-2">
                        <div className="grid-col-auto">
                            <p className="usa-footer__logo-heading">S3 Search App</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
