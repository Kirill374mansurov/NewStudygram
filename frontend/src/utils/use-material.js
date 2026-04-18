import { useEffect, useState } from "react";
import api from "../api";

export default function useMaterial(id) {
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    api
      .getMaterial({ id })
      .then((data) => {
        setMaterial(data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки материала:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return {
    material,
    setMaterial,
    isLoading,
  };
}