import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import api from "../../api";

function MaterialEdit() {
  const { id } = useParams();
  const history = useHistory();

  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    api
      .getTopics()
      .then((data) => {
        setTopics(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки тем:", err);
      });

    api
      .getMaterial({ material_id: id })
      .then((material) => {
        setForm({
          title: material.title || "",
          description: material.description || "",
          content_type: material.content_type || "article",
          link: material.link || "",
          topics: material.topics ? material.topics.map((topic) => topic.id) : [],
          estimated_time: material.estimated_time || "",
          level: material.level || "",
        });
      })
      .catch((err) => {
        console.error("Ошибка загрузки материала:", err);
      });
  }, [id]);

  if (!form) {
    return <p style={{ padding: "24px" }}>Загрузка...</p>;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleTopicChange = (topicId) => {
    setForm((prevForm) => {
      const exists = prevForm.topics.includes(topicId);

      return {
        ...prevForm,
        topics: exists
          ? prevForm.topics.filter((item) => item !== topicId)
          : [...prevForm.topics, topicId],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.topics.length) {
      alert("Выберите хотя бы одну тему.");
      return;
    }

    api
      .updateMaterial({
        material_id: id,
        ...form,
      })
      .then((material) => {
        history.push(`/materials/${material.id}`);
      })
      .catch((err) => {
        console.error("Ошибка редактирования материала:", err);
        alert("Не удалось обновить материал.");
      });
  };

  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "24px" }}>
      <h1>Редактировать учебный материал</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label>
            Название
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Описание
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="6"
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Тип материала
            <select
              name="content_type"
              value={form.content_type}
              onChange={handleChange}
              style={{ display: "block", width: "100%", padding: "8px" }}
            >
              <option value="article">Статья</option>
              <option value="video">Видео</option>
              <option value="course">Курс</option>
              <option value="book">Книга</option>
              <option value="notes">Конспект</option>
              <option value="link">Ссылка</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Ссылка
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://example.com"
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Время изучения, минут
            <input
              name="estimated_time"
              type="number"
              min="1"
              value={form.estimated_time}
              onChange={handleChange}
              style={{ display: "block", width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Уровень
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              style={{ display: "block", width: "100%", padding: "8px" }}
            >
              <option value="">Не указан</option>
              <option value="beginner">Начальный</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </label>
        </div>

        <fieldset style={{ marginBottom: "16px" }}>
          <legend>Темы</legend>

          {topics.map((topic) => (
            <label key={topic.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={form.topics.includes(topic.id)}
                onChange={() => handleTopicChange(topic.id)}
              />
              {" "}
              {topic.name}
            </label>
          ))}
        </fieldset>

        <button type="submit">
          Сохранить
        </button>
      </form>
    </main>
  );
}

export default MaterialEdit;