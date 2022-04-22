import { InputText } from "primereact/inputtext";
import React from "react";
import { Link } from "react-router-dom";
import AppSubmenu from "./AppSubmenu";

const AppMenu = (props) => {
  const [search, setSearch] = React.useState("");
  const menumode = React.useMemo(
    () => localStorage.getItem("menumode"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localStorage.getItem("menumode")]
  );
  return (
    <div className="layout-sidebar" onClick={props.onMenuClick}>
      <Link to="/" className="logo">
        <img
          id="app-logo"
          className="logo-image"
          src="assets/layout/images/logo-white.svg"
          alt="diamond layout"
        />
        <span className="app-name">DIAMOND</span>
      </Link>

      <div className="layout-menu-container">
        <AppSubmenu
          items={
            menumode === "static" || menumode === "overlay"
              ? props.model
                  .map((item) => {
                    var temp = { ...item };
                    temp.items = item.items.filter((i) =>
                      i.label.toLowerCase().includes(search.toLowerCase())
                    );
                    return temp;
                  })
                  .filter((item) => item.items.length > 0)
              : props.model
          }
          menuMode={props.menuMode}
          parentMenuItemActive
          menuActive={props.active}
          mobileMenuActive={props.mobileMenuActive}
          root
          onMenuitemClick={props.onMenuitemClick}
          onRootMenuitemClick={props.onRootMenuitemClick}
        >
          {((menumode !== "slim" && menumode !== "horizontal") || props.mobileMenuActive) && <span className="p-input-icon-left mb-2">
            <i className="pi pi-search" />
            <InputText
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search"
            />
          </span>}
        </AppSubmenu>
      </div>
    </div>
  );
};

export default AppMenu;
