import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import api from "../../api";

function MaterialDetail({ user }) {
  const { id } = useParams();
  const history = useHistory();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMaterial({ material_id: id })
      .then((data) => {
        setMaterial(data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки материала:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm("Удалить материал?")) {
      return;
    }

    api
      .deleteMaterial({ material_id: id })
      .then(() => {
        history.push("/materials");
      })
      .catch((err) => {
        console.error("Ошибка удаления материала:", err);
        alert("Не удалось удалить материал.");
      });
  };

  const handleFavorite = () => {
    const request = material.is_favorited
      ? api.removeFromFavorites({ id: material.id })
      : api.addToFavorites({ id: material.id });

    request
      .then(() => {
        setMaterial({
          ...material,
          is_favorited: !material.is_favorited,
        });
      })
      .catch((err) => {
        console.error("Ошибка избранного:", err);
        alert("Чтобы добавлять в избранное, нужно войти в аккаунт.");
      });
  };

  if (loading) {
    return <p style={{ padding: "24px" }}>Загрузка...</p>;
  }

  if (!material) {
    return <p style={{ padding: "24px" }}>Материал не найден.</p>;
  }

  const isAuthor = user && material.author && user.id === material.author.id;

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>{material.title}</h1>

      {material.cover && (
        <img
          src={material.cover}
          alt={material.title}
          style={{
            width: "100%",
            maxHeight: "360px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "16px",
          }}
        />
      )}

      <p>{material.description}</p>

      <div style={{ marginBottom: "16px" }}>
        {material.topics?.map((topic) => (
          <span
            key={topic.id}
            style={{
              display: "inline-block",
              padding: "4px 8px",
              marginRight: "6px",
              borderRadius: "8px",
              background: "#eee",
            }}
          >
            {topic.name}
          </span>
        ))}
      </div>

      <p>
        <b>Тип материала:</b> {material.content_type}
      </p>

      {material.level && (
        <p>
          <b>Уровень:</b> {material.level}
        </p>
      )}

      {material.estimated_time && (
        <p>
          <b>Время изучения:</b> {material.estimated_time} мин.
        </p>
      )}

      {material.author && (
        <p>
          <b>Автор:</b>{" "}
          <Link to={`/users/${material.author.id}`}>
            {material.author.username}
          </Link>
        </p>
      )}

      {material.link && (
        <p>
          <a href={material.link} target="_blank" rel="noreferrer">
            Открыть учебный материал
          </a>
        </p>
      )}

      <button type="button" onClick={handleFavorite}>
        {material.is_favorited ? "Убрать из избранного" : "В избранное"}
      </button>

      {isAuthor && (
        <div style={{ marginTop: "16px" }}>
          <Link to={`/materials/${material.id}/edit`}>
            Редактировать
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            style={{ marginLeft: "12px" }}
          >
            Удалить
          </button>
        </div>
      )}
    </main>
  );
}

export default MaterialDetail;