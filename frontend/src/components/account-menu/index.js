import styles from "./style.module.css";
import { useContext } from "react";
import { LinkComponent } from "../index.js";
import { AuthContext, UserContext } from "../../contexts";
import DefaultImage from "../../images/userpic-icon.jpg";

const AccountMenu = ({ onSignOut }) => {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  if (!authContext) {
    return (
      <div className={styles.accountMenu}>
        <LinkComponent
          href="/signin"
          className={styles.accountMenu__link}
          title="Войти"
        />

        <LinkComponent
          href="/signup"
          className={styles.accountMenu__button}
          title="Регистрация"
        />
      </div>
    );
  }

  return (
    <div className={styles.accountMenu}>
      <LinkComponent
        href="/materials/create"
        className={styles.accountMenu__link}
        title="Создать материал"
      />

      <LinkComponent
        href="/favorites"
        className={styles.accountMenu__link}
        title="Избранное"
      />

      <LinkComponent
        href="/subscriptions"
        className={styles.accountMenu__link}
        title="Подписки"
      />

      <LinkComponent
        href="/user"
        className={styles.accountMenu__profile}
        title={
          <>
            <span
              className={styles.accountMenu__avatar}
              style={{
                backgroundImage: `url(${userContext?.avatar || DefaultImage})`,
              }}
            />

            <span className={styles.accountMenu__name}>
              {userContext?.first_name ||
                userContext?.username ||
                "Профиль"}
            </span>
          </>
        }
      />

      <button
        type="button"
        className={styles.accountMenu__logout}
        onClick={onSignOut}
      >
        Выйти
      </button>
    </div>
  );
};

export default AccountMenu;