import styles from "./styles.module.css";
import { useContext, useState } from "react";
import { LinkComponent } from "../index.js";
import { AuthContext, UserContext } from "../../contexts";
import { UserMenu } from "../../configs/navigation";
import Icons from "../icons";
import DefaultImage from "../../images/userpic-icon.jpg";
import { AvatarPopup } from "../avatar-popup";
import api from "../../api";

const AccountData = ({ user }) => {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  return (
    <div className={styles.accountProfile}>
      <div className={styles.accountData}>
        <div className={styles.accountName}>
          {fullName || user.username || "Пользователь"}
        </div>

        {user.email && (
          <div className={styles.accountEmail}>
            {user.email}
          </div>
        )}
      </div>
    </div>
  );
};

const Account = ({ onSignOut }) => {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");

  const handleSaveAvatar = () => {
    const request = newAvatar
      ? api.changeAvatar({ file: newAvatar })
      : api.deleteAvatar();

    request
      .then((data) => {
        if (newAvatar && data?.avatar) {
          userContext.avatar = data.avatar;
        }

        if (!newAvatar) {
          userContext.avatar = "";
        }

        setNewAvatar("");
        setIsChangeAvatarOpen(false);
      })
      .catch((err) => {
        console.error("Ошибка изменения аватара:", err);
        alert("Не удалось изменить аватар.");
      });
  };

  if (!authContext || !userContext) {
    return null;
  }

  return (
    <>
      <div className={styles.accountWrapper}>
        <button
          type="button"
          className={styles.accountAvatar}
          style={{
            backgroundImage: `url(${userContext.avatar || DefaultImage})`,
          }}
          onClick={() => setIsChangeAvatarOpen(true)}
          aria-label="Изменить аватар"
        >
          <span className={styles.imageOverlay}>
            <Icons.AddAvatarIcon />
          </span>
        </button>

        <div className={styles.account}>
          <AccountData user={userContext} />

          <div className={styles.accountControls}>
            <ul className={styles.accountLinks}>
              {UserMenu.map((menuItem) => (
                <li
                  className={styles.accountLinkItem}
                  key={menuItem.href}
                >
                  <LinkComponent
                    className={styles.accountLink}
                    href={menuItem.href}
                    title={
                      <div className={styles.accountLinkTitle}>
                        <div className={styles.accountLinkIcon}>
                          {menuItem.icon}
                        </div>
                        {menuItem.title}
                      </div>
                    }
                  />
                </li>
              ))}

              <li className={styles.accountLinkItem}>
                <button
                  type="button"
                  className={styles.accountLogout}
                  onClick={onSignOut}
                >
                  <span className={styles.accountLinkIcon}>
                    <Icons.LogoutMenu />
                  </span>
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isChangeAvatarOpen && (
        <AvatarPopup
          info="Загрузите новый аватар профиля"
          avatar={userContext.avatar}
          onClose={() => {
            setNewAvatar("");
            setIsChangeAvatarOpen(false);
          }}
          onSubmit={handleSaveAvatar}
          onChange={setNewAvatar}
        />
      )}
    </>
  );
};

export default Account;