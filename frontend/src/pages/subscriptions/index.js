import React, { useEffect, useState } from "react";
import api from "../../api";
import MaterialCard from "../../components/material-card";

function Subscriptions() {
  const [materials, setMaterials] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  const normalizeList = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    return data.results || [];
  };

  const loadMaterials = () => {
    setLoading(true);

    api
      .getMaterials({
        is_subscribed: 1,
        author: selectedAuthor || undefined,
      })
      .then((data) => {
        const list = normalizeList(data);
        setMaterials(list);

        const uniqueAuthors = list.reduce((acc, material) => {
          const author = material.author;

          if (!author || acc.some((item) => item.id === author.id)) {
            return acc;
          }

          return [...acc, author];
        }, []);

        setAuthors(uniqueAuthors);
      })
      .catch((err) => {
        console.error("Ошибка загрузки материалов авторов:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFavorite = (material) => {
    const request = material.is_favorited
      ? api.removeFromFavorites({ id: material.id })
      : api.addToFavorites({ id: material.id });

    request
      .then(() => {
        setMaterials((prevMaterials) =>
          prevMaterials.map((item) =>
            item.id === material.id
              ? { ...item, is_favorited: !item.is_favorited }
              : item
          )
        );
      })
      .catch((err) => {
        console.error("Ошибка избранного:", err);
        alert("Чтобы добавлять материалы в избранное, нужно войти в аккаунт.");
      });
  };

  useEffect(() => {
    loadMaterials();
  }, [selectedAuthor]);

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
      <h1>Подписки</h1>

      <p style={{ maxWidth: "640px", color: "#667085", lineHeight: "1.5" }}>
        Здесь отображаются учебные материалы авторов, на которых вы подписаны.
      </p>

      {authors.length > 0 && (
        <section style={{ margin: "24px 0" }}>
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
              onClick={() => setSelectedAuthor(author.id)}
              style={{
                marginRight: "8px",
                marginBottom: "8px",
                fontWeight: selectedAuthor === author.id ? "700" : "400",
              }}
            >
              {author.first_name || author.username}
            </button>
          ))}
        </section>
      )}

      {loading ? (
        <p>Загрузка подписок...</p>
      ) : materials.length > 0 ? (
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
        <section
          style={{
            marginTop: "32px",
            padding: "32px",
            borderRadius: "20px",
            background: "#f6f7fb",
            border: "1px solid #e6e8f0",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Пока нет материалов</h2>
          <p style={{ marginBottom: 0, color: "#667085" }}>
            Подпишитесь на авторов учебных материалов, чтобы видеть их новые
            публикации на этой странице.
          </p>
        </section>
      )}
    </main>
  );
}

export default Subscriptions;