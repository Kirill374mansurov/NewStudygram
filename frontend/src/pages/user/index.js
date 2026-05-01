import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import MaterialCard from "../../components/material-card";

function User({ user }) {
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState("");

  useEffect(() => {
    setLoadingUser(true);
    setLoadingMaterials(true);
    setMaterialsError("");

    api
      .getUser({ id })
      .then((userData) => {
        setAuthor(userData);
      })
      .catch((err) => {
        console.error("Ошибка загрузки пользователя:", err);
        setAuthor(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });

    api
      .getMaterials({ author: id })
      .then((materialsData) => {
        setMaterials(
          Array.isArray(materialsData)
            ? materialsData
            : materialsData.results || []
        );
      })
      .catch((err) => {
        console.error("Ошибка загрузки материалов автора:", err);
        setMaterials([]);
        setMaterialsError("Не удалось загрузить материалы автора.");
      })
      .finally(() => {
        setLoadingMaterials(false);
      });
  }, [id]);

  const handleSubscribe = () => {
    if (!author) return;

    const request = author.is_subscribed
      ? api.deleteSubscriptions({ author_id: author.id })
      : api.subscribe({ author_id: author.id });

    request
      .then((updatedAuthor) => {
        if (updatedAuthor && updatedAuthor.is_subscribed !== undefined) {
          setAuthor(updatedAuthor);
        } else {
          setAuthor({
            ...author,
            is_subscribed: !author.is_subscribed,
          });
        }
      })
      .catch((err) => {
        console.error("Ошибка подписки:", err);

        const message =
          err?.errors ||
          err?.detail ||
          err?.non_field_errors?.[0] ||
          "Не удалось изменить подписку.";

        alert(Array.isArray(message) ? message.join(", ") : message);
      });
  };

  if (loadingUser) {
    return <p style={{ padding: "24px" }}>Загрузка...</p>;
  }

  if (!author) {
    return <p style={{ padding: "24px" }}>Пользователь не найден.</p>;
  }

  const isOwnProfile = user && author && Number(user.id) === Number(author.id);

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

      {!isOwnProfile && (
        <div style={{ margin: "16px 0" }}>
          <button type="button" onClick={handleSubscribe}>
            {author.is_subscribed ? "Отписаться" : "Подписаться"}
          </button>
        </div>
      )}

      <h2>Материалы автора</h2>

      {loadingMaterials ? (
        <p>Загрузка материалов...</p>
      ) : materialsError ? (
        <p>{materialsError}</p>
      ) : materials.length > 0 ? (
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