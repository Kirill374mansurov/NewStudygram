import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div>
          <Link to="/materials" className={styles.logo}>
            Studygram
          </Link>
          <p className={styles.description}>
            Платформа для поиска, создания и сохранения учебных материалов.
          </p>
        </div>

        <nav className={styles.nav}>
          <Link to="/materials" className={styles.link}>
            Материалы
          </Link>
          <Link to="/materials/create" className={styles.link}>
            Создать материал
          </Link>
          <Link to="/favorites" className={styles.link}>
            Избранное
          </Link>
        </nav>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} Studygram
        </p>
      </div>
    </footer>
  );
};

export default Footer;