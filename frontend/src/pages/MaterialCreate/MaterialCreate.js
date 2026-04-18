import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../utils/api';

function MaterialCreate() {
  const history = useHistory();

  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    content_type: 'article',
    link: '',
    topics: [],
    estimated_time: '',
    level: '',
  });

  useEffect(() => {
    api.getTopics()
      .then(setTopics)
      .catch(console.error);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTopicChange(topicId) {
    setForm((prev) => {
      const exists = prev.topics.includes(topicId);

      return {
        ...prev,
        topics: exists
          ? prev.topics.filter((id) => id !== topicId)
          : [...prev.topics, topicId],
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      estimated_time: form.estimated_time
        ? Number(form.estimated_time)
        : null,
      level: form.level || null,
      link: form.link || null,
    };

    api.createMaterial(payload)
      .then((material) => {
        history.push(`/materials/${material.id}`);
      })
      .catch(console.error);
  }

  return (
    <main>
      <h1>Создать учебный материал</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Название"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          required
        />

        <select
          name="content_type"
          value={form.content_type}
          onChange={handleChange}
        >
          <option value="article">Статья</option>
          <option value="video">Видео</option>
          <option value="course">Курс</option>
          <option value="book">Книга</option>
          <option value="notes">Конспект</option>
          <option value="link">Ссылка</option>
        </select>

        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Ссылка"
        />

        <input
          name="estimated_time"
          type="number"
          value={form.estimated_time}
          onChange={handleChange}
          placeholder="Время изучения в минутах"
        />

        <select
          name="level"
          value={form.level}
          onChange={handleChange}
        >
          <option value="">Не указан</option>
          <option value="beginner">Начальный</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>

        <fieldset>
          <legend>Темы</legend>

          {topics.map((topic) => (
            <label key={topic.id}>
              <input
                type="checkbox"
                checked={form.topics.includes(topic.id)}
                onChange={() => handleTopicChange(topic.id)}
              />
              {topic.name}
            </label>
          ))}
        </fieldset>

        <button type="submit">
          Создать
        </button>
      </form>
    </main>
  );
}

export default MaterialCreate;