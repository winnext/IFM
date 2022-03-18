import React from 'react';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import AppBreadcrumb from './AppBreadcrumb';
import keycloak from '../../keycloak';
import AppMenu from './AppMenu';
import { useAppSelector } from "../../app/hook";

const AppTopbar = (props) => {
  const auth = useAppSelector(state => state.auth)

  const Login = () => {
    keycloak.login()
  }

  const Logout = () => {
    keycloak.logout()
  }

  const notificationsItemClassName = classNames('notifications-item', {
    'active-menuitem': props.topbarNotificationMenuActive,
  });
  const profileItemClassName = classNames('profile-item', {
    'active-menuitem fadeInDown': props.topbarUserMenuActive,
  });

  return (
    <div className="layout-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="menu-button p-link"
          onClick={props.onMenuButtonClick}
        >
          <i className="pi pi-chevron-left"></i>
        </button>

        <Link to="/">
          <img
            id="logo-horizontal"
            className="horizontal-logo"
            src="assets/layout/images/logo-white.svg"
            alt="diamond-layout"
          />
        </Link>

        <span className="topbar-separator"></span>

        <div
          className="layout-breadcrumb viewname"
          style={{ textTransform: 'uppercase' }}
        >
          <AppBreadcrumb routers={props.routers} />
        </div>

        <img
          id="logo-mobile"
          className="mobile-logo"
          src="assets/layout/images/logo-dark.svg"
          alt="diamond-layout"
        />
      </div>

      <AppMenu
        model={props.menu}
        menuMode={props.menuMode}
        active={props.menuActive}
        mobileMenuActive={props.staticMenuMobileActive}
        onMenuClick={props.onMenuClick}
        onMenuitemClick={props.onMenuitemClick}
        onRootMenuitemClick={props.onRootMenuitemClick}
      ></AppMenu>

      <div className="layout-mask modal-in"></div>

      <div className="topbar-right">
        <ul className="topbar-menu">
          {auth.auth.auth ? (
            <>
              <li className="search-item">
                <button
                  type="button"
                  className="p-link"
                  onClick={props.onSearchClick}
                >
                  <i className="pi pi-search"></i>
                </button>
              </li>
              <li className={notificationsItemClassName}>
                <button
                  type="button"
                  className="p-link"
                  onClick={props.onTopbarNotification}
                >
                  <i className="pi pi-bell"></i>
                  <span className="topbar-badge">5</span>
                </button>
                <ul className="notifications-menu fade-in-up">
                  <li role="menuitem">
                    <button type="button" className="p-link" tabIndex="0">
                      <i className="pi pi-shopping-cart"></i>
                      <div className="notification-item">
                        <div className="notification-summary">New Order</div>
                        <div className="notification-detail">
                          You have <strong>3</strong> new orders.
                        </div>
                      </div>
                    </button>
                  </li>
                  <li role="menuitem">
                    <button type="button" className="p-link">
                      <i className="pi pi-check-square"></i>
                      <div className="notification-item">
                        <div className="notification-summary">
                          Withdrawn Completed
                        </div>
                        <div className="notification-detail">
                          Funds are on their way.
                        </div>
                      </div>
                    </button>
                  </li>
                  <li role="menuitem">
                    <button type="button" className="p-link">
                      <i className="pi pi-chart-line"></i>
                      <div className="notification-item">
                        <div className="notification-summary">
                          Monthly Reports
                        </div>
                        <div className="notification-detail">
                          New reports are ready.
                        </div>
                      </div>
                    </button>
                  </li>
                  <li role="menuitem">
                    <button type="button" className="p-link">
                      <i className="pi pi-comments"></i>
                      <div className="notification-item">
                        <div className="notification-summary">Comments</div>
                        <div className="notification-detail">
                          <strong>2</strong> new comments.
                        </div>
                      </div>
                    </button>
                  </li>
                  <li role="menuitem">
                    <button type="button" className="p-link">
                      <i className="pi pi-exclamation-circle"></i>
                      <div className="notification-item">
                        <div className="notification-summary">
                          Chargeback Request
                        </div>
                        <div className="notification-detail">
                          <strong>1</strong> to review.
                        </div>
                      </div>
                    </button>
                  </li>
                </ul>
              </li>

              <li className={profileItemClassName}>
                <button
                  type="button"
                  className="p-link"
                  onClick={props.onTopbarUserMenu}
                >
                  <img
                    src="assets/demo/images/avatar/profile.jpg"
                    alt="diamond-layout"
                    className="profile-image"
                  />
                  <span className="profile-name">{auth.auth.name}</span>
                </button>
                <ul className="profile-menu fade-in-up">
                  <li>
                    <button type="button" className="p-link" onClick={()=>keycloak.accountManagement()}>
                      <i className="pi pi-user"></i>
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" className="p-link">
                      <i className="pi pi-cog"></i>
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" className="p-link">
                      <i className="pi pi-calendar"></i>
                      <span>Calendar</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" className="p-link">
                      <i className="pi pi-inbox"></i>
                      <span>Inbox</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="p-link"
                      onClick={Logout}
                    >
                      <i className="pi pi-power-off"></i>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </li>

              <li className="right-sidebar-item">
                <button
                  type="button"
                  className="p-link"
                  onClick={props.onRightMenuButtonClick}
                >
                  <i className="pi pi-align-right"></i>
                </button>
              </li>
            </>
          ) : (
            <li className="right-sidebar-item">
              <Button label="Login" onClick={Login} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AppTopbar;
