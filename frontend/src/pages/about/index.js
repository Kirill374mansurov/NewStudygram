import { Container, Main } from "../../components";
import styles from "./styles.module.css";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Main>
      <MetaTags>
        <title>О проекте — Studygram</title>
        <meta
          name="description"
          content="Studygram — платформа для создания и поиска учебных материалов."
        />
        <meta property="og:title" content="О проекте — Studygram" />
      </MetaTags>

      <Container>
        <section className={styles.about}>
          <p className={styles.badge}>О проекте</p>

          <h1 className={styles.title}>Studygram</h1>

          <p className={styles.lead}>
            Studygram — это платформа для поиска, создания и сохранения
            учебных материалов. Здесь можно собрать полезные статьи, видео,
            курсы и другие ресурсы в одном месте.
          </p>

          <div className={styles.cards}>
            <article className={styles.card}>
              <h2>Создавайте материалы</h2>
              <p>
                Добавляйте учебные материалы с описанием, ссылкой, темами,
                уровнем сложности и примерным временем изучения.
              </p>
            </article>

            <article className={styles.card}>
              <h2>Ищите по темам</h2>
              <p>
                Используйте темы, чтобы быстро находить материалы по нужному
                направлению обучения.
              </p>
            </article>

            <article className={styles.card}>
              <h2>Сохраняйте полезное</h2>
              <p>
                Добавляйте материалы в избранное и возвращайтесь к ним позже.
              </p>
            </article>
          </div>

          <div className={styles.actions}>
            <Link to="/materials" className={styles.primaryLink}>
              Перейти к материалам
            </Link>

            <Link to="/materials/create" className={styles.secondaryLink}>
              Создать материал
            </Link>
          </div>
        </section>
      </Container>
    </Main>
  );
};

export default About;