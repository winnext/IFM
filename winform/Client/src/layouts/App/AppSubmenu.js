import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { classNames } from 'primereact/utils';
import { Ripple } from 'primereact/ripple';
import { Badge } from 'primereact/badge';

const AppSubmenu = (props) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onMenuItemClick = (event, item, index) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    //execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
      event.preventDefault();
    }
    if (item.items) {
      event.preventDefault();
    }
    if (props.root) {
      props.onRootMenuitemClick({
        originalEvent: event,
      });
    }
    if (item.items) {
      setActiveIndex(index === activeIndex ? null : index);
    }

    props.onMenuitemClick({
      originalEvent: event,
      item: item,
    });
  };

  const onMenuItemMouseEnter = (index) => {
    if (
      props.root &&
      props.menuActive &&
      (props.menuMode === 'slim' || props.menuMode === 'horizontal') &&
      !isMobile()
    ) {
      setActiveIndex(index);
    }
  };

  const visible = (item) => {
    return typeof item.visible === 'function'
      ? item.visible()
      : item.visible !== false;
  };

  const isMobile = () => {
    return window.innerWidth <= 1091;
  };

  const isSlim = useCallback(() => {
    return props.menuMode === 'slim';
  }, [props.menuMode]);

  const isHorizontal = useCallback(() => {
    return props.menuMode === 'horizontal';
  }, [props.menuMode]);

  const getLink = (item, index) => {
    const menuitemIconClassName = classNames('layout-menuitem-icon', item.icon);
    const content = (
      <>
        <i className={menuitemIconClassName}></i>
        <span className="layout-menuitem-text">{item.label}</span>
        {item.items && (
          <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
        )}
        {item.badge && <Badge value={item.badge} style={{ height: '100%' }} />}
        <Ripple />
      </>
    );
    const commonLinkProps = {
      style: item.style,
      className: classNames(item.className, 'p-ripple', {
        'p-disabled': item.disabled,
        'p-link': !item.to,
      }),
      target: item.target,
      onClick: (e) => onMenuItemClick(e, item, index),
      onMouseEnter: () => onMenuItemMouseEnter(index),
    };

    if (item.url) {
      return (
        <a href={item.url} rel="noopener noreferrer" {...commonLinkProps}>
          {content}
        </a>
      );
    } else if (!item.to) {
      return (
        <button type="button" {...commonLinkProps}>
          {content}
        </button>
      );
    }

    return (
      <NavLink to={item.to} {...commonLinkProps}>
        {content}
      </NavLink>
    );
  };

  const isMenuActive = (item, index) => {
    return (
      item.items &&
      (props.root &&
      (!isSlim() ||
        (isSlim() && (props.mobileMenuActive || activeIndex !== null)))
        ? true
        : activeIndex === index)
    );
  };

  const getItems = () => {
    const transitionTimeout = props.mobileMenuActive
      ? 0
      : isSlim() && props.root
      ? { enter: 400, exit: 400 }
      : props.root
      ? 0
      : { enter: 1000, exit: 450 };
    return props.items.map((item, i) => {
      if (visible(item)) {
        if (!item.separator) {
          const menuitemClassName = classNames({
            'layout-root-menuitem': props.root,
            'active-menuitem': activeIndex === i && !item.disabled,
          });
          const link = getLink(item, i);
          const rootMenuItem = props.root && (
            <div className="layout-root-menuitem">
              <div
                className="layout-menuitem-root-text"
                style={{ textTransform: 'uppercase' }}
              >
                {item.label}
              </div>
            </div>
          );

          return (
            <li
              key={item.label || i}
              className={menuitemClassName}
              role="menuitem"
            >
              {link}
              {rootMenuItem}
              <CSSTransition
                classNames="layout-menu"
                timeout={transitionTimeout}
                in={isMenuActive(item, i)}
                unmountOnExit
              >
                <AppSubmenu
                  items={visible(item) && item.items}
                  menuActive={props.menuActive}
                  menuMode={props.menuMode}
                  parentMenuItemActive={activeIndex === i}
                  onMenuitemClick={props.onMenuitemClick}
                ></AppSubmenu>
              </CSSTransition>
            </li>
          );
        } else {
          return (
            <li
              className="menu-separator"
              style={item.style}
              key={`separator${i}`}
              role="separator"
            ></li>
          );
        }
      }

      return null;
    });
  };

  useEffect(() => {
    if (!props.menuActive && isSlim()) {
      setActiveIndex(null);
    }
  }, [props.menuActive, isSlim]);

  useEffect(() => {
    if (!props.menuActive && isHorizontal()) {
      setActiveIndex(null);
    }
  }, [props.menuActive, isHorizontal]);

  if (!props.items) {
    return null;
  }

  const items = getItems();
  return (
    <ul className="layout-menu" role="menu">
      {props.children}
      {items}
    </ul>
  );
};

export default AppSubmenu;
