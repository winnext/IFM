import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const Widgets = () => {
  return (
    <div className="layout-widgets">
      <h4>Reusable CSS widgets for your applications.</h4>

      <div className="grid">
        <div className="col-12">
          <div className="card">
            <h4>Overview Boxes</h4>
            <div className="grid">
              <div className="col-12 md:col-6 xl:col-3">
                <div className="card grid-nogutter widget-overview-box widget-overview-box-1">
                  <span className="overview-icon">
                    <i className="pi pi-shopping-cart"></i>
                  </span>
                  <span className="overview-title">Orders</span>
                  <div className="grid overview-detail">
                    <div className="col-6">
                      <div className="overview-number">640</div>
                      <div className="overview-subtext">Pending</div>
                    </div>
                    <div className="col-6">
                      <div className="overview-number">1420</div>
                      <div className="overview-subtext">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-6 xl:col-3">
                <div className="card grid-nogutter widget-overview-box widget-overview-box-2">
                  <span className="overview-icon">
                    <i className="pi pi-dollar"></i>
                  </span>
                  <span className="overview-title">Revenue</span>
                  <div className="grid overview-detail">
                    <div className="col-6">
                      <div className="overview-number">$2,100</div>
                      <div className="overview-subtext">Expenses</div>
                    </div>
                    <div className="col-6">
                      <div className="overview-number">$9,640</div>
                      <div className="overview-subtext">Income</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-6 xl:col-3">
                <div className="card grid-nogutter widget-overview-box widget-overview-box-3">
                  <span className="overview-icon">
                    <i className="pi pi-users"></i>
                  </span>
                  <span className="overview-title">Customers</span>
                  <div className="grid overview-detail">
                    <div className="col-6">
                      <div className="overview-number">8272</div>
                      <div className="overview-subtext">Active</div>
                    </div>
                    <div className="col-6">
                      <div className="overview-number">25402</div>
                      <div className="overview-subtext">Registered</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-6 xl:col-3">
                <div className="card grid-nogutter widget-overview-box widget-overview-box-4">
                  <span className="overview-icon">
                    <i className="pi pi-comment"></i>
                  </span>
                  <span className="overview-title">Comments</span>
                  <div className="grid overview-detail">
                    <div className="col-6">
                      <div className="overview-number">12</div>
                      <div className="overview-subtext">New</div>
                    </div>
                    <div className="col-6">
                      <div className="overview-number">85</div>
                      <div className="overview-subtext">Responded</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 lg:col-4">
          <div className="card widget-tasks">
            <h4>Task Status</h4>
            <div>
              <div className="task task-1">
                <div className="task-name">
                  <span>12 Orders</span> to fulfill
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-2">
                <div className="task-name">
                  <span>40+ Payments</span> to withdraw
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-3">
                <div className="task-name">
                  <span>4 Reports</span> to revise
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-4">
                <div className="task-name">
                  <span>6 Questions</span> to respond
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-5">
                <div className="task-name">
                  <span>2 Chargebacks</span> to review
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 lg:col-4">
          <div className="card">
            <h4>Image List</h4>

            <ul className="widget-image-list">
              <li>
                <span>Product</span>
                <span>Sales</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/bamboo-watch.jpg"
                    alt="diamond-layout"
                  />
                  <span>Bamboo Watch</span>
                </span>
                <span className="listitem-value">82</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/blue-band.jpg"
                    alt="diamond-layout"
                  />
                  <span>Blue Band</span>
                </span>
                <span className="listitem-value">75</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/game-controller.jpg"
                    alt="diamond-layout"
                  />
                  <span>Game Controller</span>
                </span>
                <span className="listitem-value">64</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/lime-band.jpg"
                    alt="diamond-layout"
                  />
                  <span>Lime Band</span>
                </span>
                <span className="listitem-value">62</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12 lg:col-4">
          <div className="widget-pricing-card">
            <h4>PRICING</h4>
            <span>Starting from</span>
            <h3>$19</h3>
            <ul>
              <li>Responsive Layout</li>
              <li>Unlimited Push Messages</li>
              <li>50 Support Tickets</li>
              <li>Free Shipping</li>
              <li>10GB Storage</li>
            </ul>
            <button type="button" className="p-link">
              BUY NOW
            </button>
          </div>
        </div>

        <div className="col-12 lg:col-3">
          <div className="card">
            <h4>Timeline</h4>
            <div className="widget-timeline">
              <div className="timeline-event">
                <span
                  className="timeline-event-icon"
                  style={{ backgroundColor: '#64b5f6' }}
                >
                  <i className="pi pi-dollar"></i>
                </span>
                <div className="timeline-event-title">New Sale</div>
                <div className="timeline-event-detail">
                  Richard Jones has purchased a blue t-shirt for
                  <strong> $79</strong>.
                </div>
              </div>
              <div className="timeline-event">
                <span
                  className="timeline-event-icon"
                  style={{ backgroundColor: '#7986cb' }}
                >
                  <i className="timeline-icon pi pi-download"></i>
                </span>
                <div className="timeline-event-title">Withdrawal Initiated</div>
                <div className="timeline-event-detail">
                  Your request for withdrawal of
                  <strong> $2500</strong> has been initiated.
                </div>
              </div>
              <div className="timeline-event">
                <span
                  className="timeline-event-icon"
                  style={{ backgroundColor: '#4db6ac' }}
                >
                  <i className="timeline-icon pi pi-question"></i>
                </span>
                <div className="timeline-event-title">Question Received</div>
                <div className="timeline-event-detail">
                  Jane Davis has posted a<strong> new question</strong> about
                  your product.
                </div>
              </div>
              <div className="timeline-event">
                <span
                  className="timeline-event-icon"
                  style={{ backgroundColor: '#4dd0e1' }}
                >
                  <i className="timeline-icon pi pi-comment"></i>
                </span>
                <div className="timeline-event-title">Comment Received</div>
                <div className="timeline-event-detail">
                  Claire Smith has upvoted your store along with a
                  <strong> comment</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 lg:col-9">
          <div className="card">
            <h4>Chat</h4>
            <div className="widget-chat">
              <ul>
                <li className="message-from">
                  <img
                    src="assets/demo/images/avatar/ionibowcher.png"
                    alt="diamond-layout"
                  />
                  <div>
                    Retro occupy organic, stumptown shabby chic pour-over roof
                    party DIY normcore.
                  </div>
                </li>
                <li className="message-own">
                  <img
                    src="assets/demo/images/avatar/onyamalimba.png"
                    alt="diamond-layout"
                  />
                  <div>
                    Actually artisan organic occupy, Wes Anderson ugh whatever
                    pour-over gastropub selvage.
                  </div>
                </li>
                <li className="message-from">
                  <img
                    src="assets/demo/images/avatar/ionibowcher.png"
                    alt="diamond-layout"
                  />
                  <div>
                    Chillwave craft beer tote bag stumptown quinoa hashtag.
                  </div>
                </li>
                <li className="message-own">
                  <img
                    src="assets/demo/images/avatar/onyamalimba.png"
                    alt="diamond-layout"
                  />
                  <div>
                    Dreamcatcher locavore iPhone chillwave, occupy trust fund
                    slow-carb distillery art party narwhal.
                  </div>
                </li>
              </ul>
              <div className="new-message">
                <div className="message-attachment">
                  <i className="pi pi-paperclip"></i>
                </div>
                <div className="message-input">
                  <input
                    type="text"
                    placeholder="Write a message"
                    className="p-inputtext"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 lg:col-4">
          <div className="card">
            <h4>Person List</h4>
            <ul className="widget-person-list">
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/amyelsner.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Amy Elsner</div>
                    <div className="person-subtext">Accounting</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/annafali.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Anna Fali</div>
                    <div className="person-subtext">Procurement</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/bernardodominic.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Bernardo Dominic</div>
                    <div className="person-subtext">Finance</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/ivanmagalhaes.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Ivan Magalhaes</div>
                    <div className="person-subtext">Sales</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/xuxuefeng.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Xuxue Feng</div>
                    <div className="person-subtext">Management</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12 lg:col-4">
          <div className="card widget-user-card">
            <div className="user-card-header">
              <img
                src="assets/demo/images/avatar/profile.jpg"
                className="user-card-avatar"
                alt="diamond-layout"
              />
            </div>
            <div className="user-card-body">
              <div className="user-card-title">AMELIA STONE</div>
              <div className="user-card-subtext">Sales Team</div>

              <div className="grid user-card-stats">
                <div className="col-4">
                  <i className="pi pi-users"></i>
                  <div>14 Clients</div>
                </div>
                <div className="col-4">
                  <i className="pi pi-bookmark"></i>
                  <div>2 Leads</div>
                </div>
                <div className="col-4">
                  <i className="pi pi-check-square"></i>
                  <div>6 Tasks</div>
                </div>
              </div>

              <Button label="Assign" style={{ width: '100%' }}></Button>
            </div>
          </div>
        </div>

        <div className="col-12 lg:col-4">
          <div className="card p-fluid">
            <h4>Contact Form</h4>
            <div className="field">
              <label htmlFor="firstname">First Name</label>
              <InputText id="firstname" />
            </div>
            <div className="field">
              <label htmlFor="lastname">Last Name</label>
              <InputText id="lastname" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText id="email" />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <InputTextarea id="message"></InputTextarea>
            </div>
            <Button label="Send"></Button>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <h4>Feature Box</h4>
            <div className="grid">
              <div className="col-12 md:col-6 lg:col-3">
                <div className="card widget-feature-box">
                  <img
                    src="assets/layout/images/pages/landing/icon-devices.svg"
                    alt="diamond-layout"
                  />
                  <h2>Responsive</h2>
                  <span>
                    Nam non ligula sed urna malesuada lacinia. Aliquam sed
                    viverra ipsum.
                  </span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <div className="card widget-feature-box">
                  <img
                    src="assets/layout/images/pages/landing/icon-design.svg"
                    alt="diamond-layout"
                  />
                  <h2>Modern Design</h2>
                  <span>
                    Nam non ligula sed urna malesuada lacinia. Aliquam sed
                    viverra ipsum.
                  </span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <div className="card widget-feature-box">
                  <img
                    src="assets/layout/images/pages/landing/icon-document.svg"
                    alt="diamond-layout"
                  />
                  <h2>Well Documented</h2>
                  <span>
                    Nam non ligula sed urna malesuada lacinia. Aliquam sed
                    viverra ipsum.
                  </span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <div className="card widget-feature-box">
                  <img
                    src="assets/layout/images/pages/landing/icon-diamond.svg"
                    alt="diamond-layout"
                  />
                  <h2>Premium Support</h2>
                  <span>
                    Nam non ligula sed urna malesuada lacinia. Aliquam sed
                    viverra ipsum.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Widgets, comparisonFn);
