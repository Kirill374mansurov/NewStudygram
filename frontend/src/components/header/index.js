import React from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./style.module.css";

const Header = ({ loggedIn, onSignOut }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/materials" className={styles.logo}>
          Studygram
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/materials" className={styles.link}>
            Материалы
          </NavLink>

          {loggedIn ? (
            <>
              <NavLink to="/materials/create" className={styles.link}>
                Создать материал
              </NavLink>
              <NavLink to="/favorites" className={styles.link}>
                Избранное
              </NavLink>
              <NavLink to="/subscriptions" className={styles.link}>
                Подписки
              </NavLink>
              <button type="button" onClick={onSignOut} className={styles.button}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={styles.link}>
                Войти
              </NavLink>
              <NavLink to="/signup" className={styles.buttonLink}>
                Регистрация
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;