import { useEffect, useState } from 'react';
import api from '../../utils/api';
import MaterialCard from '../../pages/material/MaterialCard';

function MaterialsFeed() {
  const [materials, setMaterials] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    api.getTopics()
      .then(setTopics)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = selectedTopic ? { topics: selectedTopic } : {};

    api.getMaterials(params)
      .then((data) => {
        setMaterials(data.results || data);
      })
      .catch(console.error);
  }, [selectedTopic]);

  return (
    <main>
      <h1>Учебные материалы</h1>

      <div>
        <button onClick={() => setSelectedTopic('')}>
          Все темы
        </button>

        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic.slug)}
          >
            {topic.name}
          </button>
        ))}
      </div>

      <section>
        {materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
          />
        ))}
      </section>
    </main>
  );
}

export default MaterialsFeed;

function handleFavorite(material) {
  const request = material.is_favorited
    ? api.removeFavorite(material.id)
    : api.addFavorite(material.id);

  request
    .then(() => {
      setMaterials((items) =>
        items.map((item) =>
          item.id === material.id
            ? { ...item, is_favorited: !item.is_favorited }
            : item
        )
      );
    })
    .catch(console.error);
}

<MaterialCard
  key={material.id}
  material={material}
  onFavorite={handleFavorite}
/>