export default function Header() {
    return (
        <>
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
                            </div>
                        </div>
                    </header>
                </div>
            </div>
            <header className="usa-header usa-header--basic">
                <div className="usa-nav-container">
                    <div className="usa-navbar">
                        <div className="usa-logo">
                            <em className="usa-logo__text">S3 File Manager</em>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
