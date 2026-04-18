import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import MaterialCard from "../../components/material-card";

function User() {
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserPage = () => {
    setLoading(true);

    Promise.all([
      api.getUser({ id }),
      api.getMaterials({ author: id }),
    ])
      .then(([userData, materialsData]) => {
        setAuthor(userData);
        setMaterials(
          Array.isArray(materialsData)
            ? materialsData
            : materialsData.results || []
        );
      })
      .catch((err) => {
        console.error("Ошибка загрузки пользователя:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUserPage();
  }, [id]);

  const handleSubscribe = () => {
    const request = author.is_subscribed
      ? api.deleteSubscriptions({ author_id: author.id })
      : api.subscribe({ author_id: author.id });

    request
      .then(() => {
        setAuthor({
          ...author,
          is_subscribed: !author.is_subscribed,
        });
      })
      .catch((err) => {
        console.error("Ошибка подписки:", err);
        alert("Чтобы подписываться, нужно войти в аккаунт.");
      });
  };

  if (loading) {
    return <p style={{ padding: "24px" }}>Загрузка...</p>;
  }

  if (!author) {
    return <p style={{ padding: "24px" }}>Пользователь не найден.</p>;
  }

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>{author.username}</h1>

      <p>{author.email}</p>

      {author.avatar && (
        <img
          src={author.avatar}
          alt={author.username}
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      )}

      <div style={{ margin: "16px 0" }}>
        <button type="button" onClick={handleSubscribe}>
          {author.is_subscribed ? "Отписаться" : "Подписаться"}
        </button>
      </div>

      <h2>Материалы автора</h2>

      {materials.length > 0 ? (
        materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))
      ) : (
        <p>У автора пока нет материалов.</p>
      )}
    </main>
  );
}

export default User;