import React from "react";
import { Link } from "react-router-dom";

const Header = ({ loggedIn, onSignOut }) => {
  return (
    <header style={{
      padding: "16px 24px",
      borderBottom: "1px solid #ddd",
      marginBottom: "24px"
    }}>
      <nav style={{
        display: "flex",
        gap: "16px",
        alignItems: "center"
      }}>
        <Link to="/materials">
          <b>Studygram</b>
        </Link>

        <Link to="/materials">Материалы</Link>

        {loggedIn && (
          <>
            <Link to="/materials/create">Создать материал</Link>
            <Link to="/favorites">Избранное</Link>
            <Link to="/subscriptions">Подписки</Link>
            <Link to="/update-avatar">Аватар</Link>
            <Link to="/change-password">Пароль</Link>
            <button type="button" onClick={onSignOut}>
              Выйти
            </button>
          </>
        )}

        {!loggedIn && (
          <>
            <Link to="/signin">Войти</Link>
            <Link to="/signup">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;