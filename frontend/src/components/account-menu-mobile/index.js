import styles from "./style.module.css";
import { useContext } from "react";
import { LinkComponent } from "../index.js";
import { AuthContext, UserContext } from "../../contexts";
import DefaultImage from "../../images/userpic-icon.jpg";

const AccountMenuMobile = ({ onSignOut }) => {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  if (!authContext) {
    return (
      <div className={styles.accountMenuMobile}>
        <LinkComponent
          href="/signin"
          className={styles.accountMenuMobile__link}
          title="Войти"
        />

        <LinkComponent
          href="/signup"
          className={styles.accountMenuMobile__button}
          title="Регистрация"
        />
      </div>
    );
  }

  return (
    <div className={styles.accountMenuMobile}>
      <LinkComponent
        href="/user"
        className={styles.accountMenuMobile__profile}
        title={
          <>
            <span
              className={styles.accountMenuMobile__avatar}
              style={{
                backgroundImage: `url(${userContext?.avatar || DefaultImage})`,
              }}
            />

            <span>
              {userContext?.first_name ||
                userContext?.username ||
                "Профиль"}
            </span>
          </>
        }
      />

      <LinkComponent
        href="/materials/create"
        className={styles.accountMenuMobile__link}
        title="Создать материал"
      />

      <LinkComponent
        href="/favorites"
        className={styles.accountMenuMobile__link}
        title="Избранное"
      />

      <LinkComponent
        href="/subscriptions"
        className={styles.accountMenuMobile__link}
        title="Подписки"
      />

      <LinkComponent
        href="/change-password"
        className={styles.accountMenuMobile__link}
        title="Сменить пароль"
      />

      <button
        type="button"
        className={styles.accountMenuMobile__logout}
        onClick={onSignOut}
      >
        Выйти
      </button>
    </div>
  );
};

export default AccountMenuMobile;