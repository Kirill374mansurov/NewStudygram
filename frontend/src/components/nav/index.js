import styles from "./style.module.css";
import { useEffect, useState } from "react";
import {
  AccountMenu,
  NavMenu,
  AccountMenuMobile,
} from "../index.js";
import cn from "classnames";
import { useLocation } from "react-router-dom";
import hamburgerImg from "../../images/hamburger-menu.png";
import hamburgerImgClose from "../../images/hamburger-menu-close.png";

const Nav = ({ loggedIn, onSignOut }) => {
  const [menuToggled, setMenuToggled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const closeMenu = () => {
      setMenuToggled(false);
    };

    window.addEventListener("resize", closeMenu);

    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  useEffect(() => {
    setMenuToggled(false);
  }, [location.pathname]);

  return (
    <div className={styles.nav}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuToggled(!menuToggled)}
        aria-label={menuToggled ? "Закрыть меню" : "Открыть меню"}
      >
        <img
          src={menuToggled ? hamburgerImgClose : hamburgerImg}
          alt=""
        />
      </button>

      <div className={styles.nav__container}>
        <NavMenu loggedIn={loggedIn} />
        <AccountMenu onSignOut={onSignOut} />
      </div>

      <div
        className={cn(styles["nav__container-mobile"], {
          [styles["nav__container-mobile_visible"]]: menuToggled,
        })}
      >
        <NavMenu loggedIn={loggedIn} />
        <AccountMenuMobile onSignOut={onSignOut} />
      </div>
    </div>
  );
};

export default Nav;