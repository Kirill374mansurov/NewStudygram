import React, { useEffect, useState } from "react";
import api from "../../api";
import MaterialCard from "../../components/material-card";

function Favorites() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () => {
    setLoading(true);

    api
      .getMaterials({ is_favorited: 1 })
      .then((data) => {
        setMaterials(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки избранного:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavorite = (material) => {
    api
      .removeFromFavorites({ id: material.id })
      .then(() => {
        setMaterials((prevMaterials) =>
          prevMaterials.filter((item) => item.id !== material.id)
        );
      })
      .catch((err) => {
        console.error("Ошибка удаления из избранного:", err);
      });
  };

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>Избранное</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : materials.length > 0 ? (
        materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onFavorite={handleFavorite}
          />
        ))
      ) : (
        <p>В избранном пока ничего нет.</p>
      )}
    </main>
  );
}

export default Favorites;