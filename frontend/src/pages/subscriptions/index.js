import React, { useEffect, useMemo, useState } from "react";
import api from "../../api";
import MaterialCard from "../../components/material-card";

function Subscriptions() {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  const normalizeList = (data) => {
    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  };

  const loadSubscriptions = () => {
    setLoading(true);

    api
      .getSubscriptions({
        page: 1,
        limit: 50,
        materials_limit: 20,
      })
      .then((data) => {
        setAuthors(normalizeList(data));
      })
      .catch((err) => {
        console.error("Ошибка загрузки подписок:", err);
        setAuthors([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const visibleAuthors = useMemo(() => {
    if (!selectedAuthor) {
      return authors;
    }
    return authors.filter(
      (author) => String(author.id) === String(selectedAuthor)
    );
  }, [authors, selectedAuthor]);

  const materials = useMemo(() => {
    return visibleAuthors.flatMap((author) =>
      (author.materials || []).map((material) => ({
        ...material,
        author: {
          id: author.id,
          username: author.username,
          first_name: author.first_name,
          last_name: author.last_name,
          email: author.email,
          avatar: author.avatar,
          is_subscribed: author.is_subscribed,
        },
      }))
    );
  }, [visibleAuthors]);

  const handleFavorite = (material) => {
    const request = material.is_favorited
      ? api.removeFromFavorites({ id: material.id })
      : api.addToFavorites({ id: material.id });

    request
      .then(() => {
        setAuthors((prevAuthors) =>
          prevAuthors.map((author) => ({
            ...author,
            materials: (author.materials || []).map((item) =>
              item.id === material.id
                ? { ...item, is_favorited: !item.is_favorited }
                : item
            ),
          }))
        );
      })
      .catch((err) => {
        console.error("Ошибка избранного:", err);
        alert("Не удалось изменить избранное.");
      });
  };

  if (loading) {
    return (
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
        <h1>Подписки</h1>
        <p>Загрузка подписок...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>Подписки</h1>

      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Здесь отображаются учебные материалы авторов, на которых вы подписаны.
      </p>

      {authors.length > 0 && (
        <section style={{ marginBottom: "24px" }}>
          <h2>Авторы</h2>

          <button
            type="button"
            onClick={() => setSelectedAuthor("")}
            style={{ marginRight: "8px" }}
          >
            Все авторы
          </button>

          {authors.map((author) => (
            <button
              key={author.id}
              type="button"
              onClick={() => setSelectedAuthor(String(author.id))}
              style={{
                marginRight: "8px",
                marginBottom: "8px",
                fontWeight:
                  String(selectedAuthor) === String(author.id) ? "700" : "400",
              }}
            >
              {author.first_name || author.username}
            </button>
          ))}
        </section>
      )}

      {materials.length > 0 ? (
        <section>
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onFavorite={handleFavorite}
            />
          ))}
        </section>
      ) : (
        <section>
          <h2>Пока нет материалов</h2>
          <p>
            Подпишитесь на авторов учебных материалов, чтобы видеть их новые
            публикации на этой странице.
          </p>
        </section>
      )}
    </main>
  );
}

export default Subscriptions;