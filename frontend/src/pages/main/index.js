import React, { useEffect, useState } from "react";
import api from "../../api";
import MaterialCard from "../../components/material-card";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const normalizeList = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    return data.results || [];
  };

  const loadTopics = () => {
    api
      .getTopics()
      .then((data) => {
        setTopics(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки тем:", err);
      });
  };

  const loadMaterials = () => {
    setLoading(true);

    const topicSlugs = selectedTopics.map((topic) => topic.slug);

    api
      .getMaterials({
        page,
        limit: 6,
        topics: topicSlugs,
      })
      .then((data) => {
        setMaterials(normalizeList(data));

        if (data.count) {
          setPagesCount(Math.ceil(data.count / 6));
        } else {
          setPagesCount(1);
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки материалов:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [page, selectedTopics]);

  const handleTopicClick = (topic) => {
    setPage(1);

    setSelectedTopics((prevTopics) => {
      const alreadySelected = prevTopics.some((item) => item.id === topic.id);

      if (alreadySelected) {
        return prevTopics.filter((item) => item.id !== topic.id);
      }

      return [...prevTopics, topic];
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
        alert("Чтобы добавлять в избранное, нужно войти в аккаунт.");
      });
  };

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>Учебные материалы</h1>

      <section style={{ marginBottom: "24px" }}>
        <h2>Темы</h2>

        <button
          type="button"
          onClick={() => {
            setSelectedTopics([]);
            setPage(1);
          }}
          style={{ marginRight: "8px" }}
        >
          Все
        </button>

        {topics.map((topic) => {
          const active = selectedTopics.some((item) => item.id === topic.id);

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleTopicClick(topic)}
              style={{
                marginRight: "8px",
                marginBottom: "8px",
                fontWeight: active ? "700" : "400",
              }}
            >
              {topic.name}
            </button>
          );
        })}
      </section>

      {loading ? (
        <p>Загрузка...</p>
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
        <p>Материалов пока нет.</p>
      )}

      {pagesCount > 1 && (
        <div style={{ marginTop: "24px" }}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Назад
          </button>

          <span style={{ margin: "0 12px" }}>
            {page} / {pagesCount}
          </span>

          <button
            type="button"
            disabled={page >= pagesCount}
            onClick={() => setPage(page + 1)}
          >
            Вперёд
          </button>
        </div>
      )}
    </main>
  );
}

export default Materials;