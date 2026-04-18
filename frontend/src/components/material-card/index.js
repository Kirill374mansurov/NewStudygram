import React from "react";
import { Link } from "react-router-dom";

function MaterialCard({ material, onFavorite }) {
  const handleFavoriteClick = () => {
    if (onFavorite) {
      onFavorite(material);
    }
  };

  return (
    <article style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "16px",
      background: "#fff"
    }}>
      {material.cover && (
        <img
          src={material.cover}
          alt={material.title}
          style={{
            width: "100%",
            maxHeight: "220px",
            objectFit: "cover",
            borderRadius: "8px"
          }}
        />
      )}

      <h2>
        <Link to={`/materials/${material.id}`}>
          {material.title}
        </Link>
      </h2>

      <p>{material.description}</p>

      <div style={{ marginBottom: "8px" }}>
        {material.topics?.map((topic) => (
          <span
            key={topic.id}
            style={{
              display: "inline-block",
              padding: "4px 8px",
              marginRight: "6px",
              borderRadius: "8px",
              background: "#eee"
            }}
          >
            {topic.name}
          </span>
        ))}
      </div>

      <p>
        <b>Тип:</b> {material.content_type}
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

      {onFavorite && (
        <button type="button" onClick={handleFavoriteClick}>
          {material.is_favorited ? "Убрать из избранного" : "В избранное"}
        </button>
      )}
    </article>
  );
}

export default MaterialCard;