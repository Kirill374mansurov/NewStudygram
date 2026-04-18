import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

function MaterialPage() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);

  useEffect(() => {
    api.getMaterial(id)
      .then(setMaterial)
      .catch(console.error);
  }, [id]);

  if (!material) {
    return <p>Загрузка...</p>;
  }

  return (
    <main>
      <h1>{material.title}</h1>

      {material.cover && (
        <img src={material.cover} alt={material.title} />
      )}

      <p>{material.description}</p>

      <p>Автор: {material.author?.username}</p>

      <div>
        {material.topics?.map((topic) => (
          <span key={topic.id}>{topic.name}</span>
        ))}
      </div>

      {material.link && (
        <a href={material.link} target="_blank" rel="noreferrer">
          Открыть материал
        </a>
      )}

      {material.estimated_time && (
        <p>Время изучения: {material.estimated_time} мин.</p>
      )}

      {material.level && (
        <p>Уровень: {material.level}</p>
      )}
    </main>
  );
}

export default MaterialPage;