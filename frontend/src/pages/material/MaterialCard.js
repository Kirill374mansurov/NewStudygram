import { Link } from 'react-router-dom';

function MaterialCard({ material, onFavorite }) {
  return (
    <article>
      {material.cover && (
        <img src={material.cover} alt={material.title} />
      )}

      <h2>
        <Link to={`/materials/${material.id}`}>
          {material.title}
        </Link>
      </h2>

      <p>{material.description}</p>

      <div>
        {material.topics?.map((topic) => (
          <span key={topic.id}>
            {topic.name}
          </span>
        ))}
      </div>

      <p>Тип: {material.content_type}</p>

      {material.level && (
        <p>Уровень: {material.level}</p>
      )}

      {material.estimated_time && (
        <p>Время изучения: {material.estimated_time} мин.</p>
      )}

      <p>
        Автор: {material.author?.username}
      </p>

      {onFavorite && (
        <button onClick={() => onFavorite(material)}>
          {material.is_favorited ? 'Убрать из избранного' : 'В избранное'}
        </button>
      )}
    </article>
  );
}

export default MaterialCard;