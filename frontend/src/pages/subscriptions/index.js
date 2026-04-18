import React, { useEffect, useState } from "react";
import api from "../../api";
import MaterialCard from "../../components/material-card";

function Subscriptions() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = () => {
    setLoading(true);

    api
      .getSubscriptions({ page: 1, limit: 20, materials_limit: 3 })
      .then((data) => {
        setAuthors(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки подписок:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleUnsubscribe = (authorId) => {
    api
      .deleteSubscriptions({ author_id: authorId })
      .then(() => {
        setAuthors((prevAuthors) =>
          prevAuthors.filter((author) => author.id !== authorId)
        );
      })
      .catch((err) => {
        console.error("Ошибка отписки:", err);
      });
  };

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>Мои подписки</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : authors.length > 0 ? (
        authors.map((author) => (
          <section
            key={author.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <h2>{author.username}</h2>
            <p>{author.email}</p>

            <button
              type="button"
              onClick={() => handleUnsubscribe(author.id)}
            >
              Отписаться
            </button>

            <h3>Материалы автора</h3>

            {author.materials && author.materials.length > 0 ? (
              author.materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))
            ) : (
              <p>У автора пока нет материалов.</p>
            )}
          </section>
        ))
      ) : (
        <p>Вы пока ни на кого не подписаны.</p>
      )}
    </main>
  );
}

export default Subscriptions;