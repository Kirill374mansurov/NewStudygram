import styles from "./style.module.css";
import { LinkComponent } from "../index.js";

const NavMenu = ({ loggedIn }) => {
  return (
    <nav className={styles.navMenu}>
      <LinkComponent
        href="/materials"
        className={styles.navMenu__link}
        activeClassName={styles.navMenu__link_active}
        title="Материалы"
      />

      {loggedIn && (
        <>
          <LinkComponent
            href="/materials/create"
            className={styles.navMenu__link}
            activeClassName={styles.navMenu__link_active}
            title="Создать материал"
          />

          <LinkComponent
            href="/favorites"
            className={styles.navMenu__link}
            activeClassName={styles.navMenu__link_active}
            title="Избранное"
          />

          <LinkComponent
            href="/subscriptions"
            className={styles.navMenu__link}
            activeClassName={styles.navMenu__link_active}
            title="Подписки"
          />
        </>
      )}
    </nav>
  );
};

export default NavMenu;