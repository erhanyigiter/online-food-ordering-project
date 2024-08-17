import React from 'react';

const Sidebar = ({ onSortChange }) => {
  const handleSortingChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="w-64 p-4 border-r bg-white">
      <h2 className="text-xl font-bold mb-4">Filtrele</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sıralama</h3>
        <div className="flex flex-col gap-2">
          <label>
            <input type="radio" name="sorting" value="recommended" onChange={handleSortingChange} /> Önerilen (Varsayılan)
          </label>
          <label>
            <input type="radio" name="sorting" value="deliveryTime" onChange={handleSortingChange} /> Teslimat Süresi
          </label>
          <label>
            <input type="radio" name="sorting" value="distance" onChange={handleSortingChange} /> Mesafe
          </label>
          <label>
            <input type="radio" name="sorting" value="rating" onChange={handleSortingChange} /> Restoran Puanı
          </label>
          <label>
            <input type="radio" name="sorting" value="highestPrice" onChange={handleSortingChange} /> En Yüksek Fiyat
          </label>
          <label>
            <input type="radio" name="sorting" value="lowestPrice" onChange={handleSortingChange} /> En Düşük Fiyat
          </label>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
