import styles from "./style.module.css";
import { LinkComponent } from "../index.js";
import DefaultImage from "../../images/userpic-icon.jpg";
import api from "../../api";

const Subscription = ({ author, onUnsubscribe }) => {
  if (!author) {
    return null;
  }

  const handleUnsubscribe = () => {
    api
      .deleteSubscriptions({ id: author.id })
      .then(() => {
        if (onUnsubscribe) {
          onUnsubscribe(author.id);
        }
      })
      .catch((err) => {
        console.error("Ошибка отписки от автора:", err);
        alert("Не удалось отписаться от автора.");
      });
  };

  return (
    <article className={styles.subscription}>
      <div className={styles.author}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: `url(${author.avatar || DefaultImage})`,
          }}
        />

        <div className={styles.authorInfo}>
          <LinkComponent
            href={`/users/${author.id}`}
            className={styles.authorName}
            title={
              author.first_name || author.last_name
                ? `${author.first_name || ""} ${author.last_name || ""}`.trim()
                : author.username || "Автор"
            }
          />

          {author.email && (
            <p className={styles.authorEmail}>
              {author.email}
            </p>
          )}

          <p className={styles.authorDescription}>
            Учебные материалы автора доступны в вашей ленте подписок.
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <LinkComponent
          href={`/materials?author=${author.id}`}
          className={styles.materialsLink}
          title="Материалы автора"
        />

        <button
          type="button"
          className={styles.unsubscribeButton}
          onClick={handleUnsubscribe}
        >
          Отписаться
        </button>
      </div>
    </article>
  );
};

export default Subscription;