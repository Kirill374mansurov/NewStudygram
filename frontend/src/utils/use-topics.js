import { useEffect, useState } from "react";
import api from "../api";

export default function useTopics() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getTopics()
      .then((data) => {
        setTopics(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки тем:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    topics,
    setTopics,
    isLoading,
  };
}