import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

const Help = () => {

    return (
        <div className="grid help-page">
            <div className="col-12">
                <div className="card help-search grid">
                    <div className="help-search-content col-12 md:col-6">
                        <h4>We are here to help</h4>
                        <div className="search-container">
                            <i className="pi pi-search"></i>
                            <input type="text" className="p-inputtext" placeholder="Search" />
                        </div>
                    </div>
                    <div className="help-search-effect col-12 md:col-6"></div>
                </div>
            </div>

            <div className="col-12 lg:col-6">
                    <h6>General</h6>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Header I">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </AccordionTab>
                        <AccordionTab header="Header II">
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                                voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
                        </AccordionTab>
                        <AccordionTab header="Header III">
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                                cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</p>
                        </AccordionTab>
                    </Accordion>

                    <h6>FAQ</h6>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="FAQ I">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </AccordionTab>
                        <AccordionTab header="FAQ II">
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                                voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
                        </AccordionTab>
                        <AccordionTab header="FAQ III">
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                                cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</p>
                        </AccordionTab>
                    </Accordion>
            </div>


            <div className="col-12 lg:col-6">
                <div className="card status-card">
                    <h6>System Status</h6>
                    <p>All services are operational.</p>
                    <div className="status-bars">
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar status-bar-failure"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                        <div className="status-bar"></div>
                    </div>
                    <div className="status-bar-footer">
                        <span>30 Days Ago</span>
                        <span>Today</span>
                    </div>
                </div>

                <div className="card articles-card">
                    <h6>Articles</h6>
                    <p>Recent articles from our team.</p>
                    <div className="blog-posts">
                        <div className="blog-post">
                            <div className="blog-text">
                                <h6>Building Revenue With Confidence</h6>
                                <span>And avoiding failures</span>
                            </div>
                            <div className="blog-profile">
                                <img src="assets/demo/images/avatar/miracle.png" alt="atlantis-layout" />
                            </div>
                        </div>

                        <div className="blog-post">
                            <div className="blog-text">
                                <h6>Latest Marketing Trends</h6>
                                <span>Don't miss out our tips</span>
                            </div>
                            <div className="blog-profile">
                                <img src="assets/demo/images/avatar/kaylynn.png" alt="atlantis-layout" />
                            </div>
                        </div>

                        <div className="blog-post">
                            <div className="blog-text">
                                <h6>How To Reach Your Audience</h6>
                                <span>10 ways to increase your efficiency</span>
                            </div>
                            <div className="blog-profile">
                                <img src="assets/demo/images/avatar/angel.png" alt="atlantis-layout" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Help, comparisonFn);
