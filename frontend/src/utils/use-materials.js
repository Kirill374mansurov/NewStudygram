import { useEffect, useState } from "react";
import api from "../api";

export default function useMaterials(params = {}) {
  const [materials, setMaterials] = useState([]);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadMaterials = () => {
    setIsLoading(true);

    api
      .getMaterials(params)
      .then((data) => {
        if (Array.isArray(data)) {
          setMaterials(data);
          setMaterialsCount(data.length);
        } else {
          setMaterials(data.results || []);
          setMaterialsCount(data.count || 0);
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки материалов:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadMaterials();
  }, [JSON.stringify(params)]);

  return {
    materials,
    setMaterials,
    materialsCount,
    isLoading,
    reloadMaterials: loadMaterials,
  };
}