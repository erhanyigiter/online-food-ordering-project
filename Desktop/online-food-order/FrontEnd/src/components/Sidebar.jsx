import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 p-4 border-r bg-white">
      <h2 className="text-xl font-bold mb-4">Filtrele</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sıralama</h3>
        <div className="flex flex-col gap-2">
          <label>
            <input type="radio" name="sorting" /> Önerilen (Varsayılan)
          </label>
          <label>
            <input type="radio" name="sorting" /> Teslimat Süresi
          </label>
          <label>
            <input type="radio" name="sorting" /> Mesafe
          </label>
          <label>
            <input type="radio" name="sorting" /> Restoran Puanı
          </label>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Hızlı Filtreler</h3>
        <div className="flex flex-col gap-2">
          <button className="border rounded px-2 py-1">Express Teslimat</button>
          <button className="border rounded px-2 py-1">Süper Restoran</button>
          <button className="border rounded px-2 py-1">Promosyonlu</button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Mutfak</h3>
        <input
          type="text"
          placeholder="Mutfak arayın"
          className="w-full border rounded mb-2 p-2"
        />
        <div className="flex flex-col gap-2">
          <label>
            <input type="checkbox" /> Balık ve Deniz Ürünleri
          </label>
          <label>
            <input type="checkbox" /> Burger
          </label>
          <label>
            <input type="checkbox" /> Çiğ Köfte
          </label>
          <label>
            <input type="checkbox" /> Dondurma
          </label>
          <label>
            <input type="checkbox" /> Döner
          </label>
          <label>
            <input type="checkbox" /> Dünya Mutfağı
          </label>
          <label>
            <input type="checkbox" /> Ev Yemekleri
          </label>
          <label>
            <input type="checkbox" /> Kahvaltı & Börek
          </label>
          <label>
            <input type="checkbox" /> Kahve
          </label>
          <button className="text-blue-500">Daha fazla göster</button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Ödeme Seçenekleri</h3>
        <div className="flex flex-col gap-2">
          <label>
            <input type="radio" name="payment" /> Tümü
          </label>
          <label>
            <input type="radio" name="payment" /> Cüzdan
          </label>
          <label>
            <input type="radio" name="payment" /> Nakit
          </label>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
