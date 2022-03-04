import React, { useState } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const AppRightMenu = (props) => {
  const amount = [
    {
      label: '*****24',
      value: { id: 1, name: '*****24', code: 'A1' },
    },
    {
      label: '*****75',
      value: { id: 2, name: '*****75', code: 'A2' },
    },
  ];

  const [selectedAmount, setSelectedAmount] = useState(amount[0].value);

  const sidebarClassName = classNames('layout-sidebar-right', {
    'layout-sidebar-right-active': props.rightMenuActive,
  });

  return (
    <div className={sidebarClassName} onClick={props.onRightMenuClick}>
      <h5>Activity</h5>
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
            <strong>$79</strong>.
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
            Your request for withdrawal of <strong>$2500</strong> has been
            initiated.
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
            Jane Davis has posted a <strong>new question</strong> about your
            product.
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
            <strong>comment</strong>.
          </div>
        </div>
      </div>

      <hr />

      <h5>Quick Withdraw</h5>

      <div className="withdraw p-fluid">
        <div>
          <InputText type="text" placeholder="Amount" />
        </div>
        <div>
          <Dropdown
            options={amount}
            optionLabel="label"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.value)}
          ></Dropdown>
        </div>
        <div>
          <Button type="button" label="Confirm" icon="pi pi-check"></Button>
        </div>
      </div>

      <hr />

      <h5>Shipment Tracking</h5>
      <p>Track your ongoing shipments to customers.</p>
      <img
        className="logo-image"
        src="assets/demo/images/sidebar-right/staticmap.png"
        alt="logo-shipment"
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default AppRightMenu;
