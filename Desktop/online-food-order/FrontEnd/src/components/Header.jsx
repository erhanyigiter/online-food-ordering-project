import { useState } from 'react';
import { Link } from "react-router-dom";
import { BsBasket3, BsFillHouseFill, BsBoxArrowInRight, BsPersonPlus, BsClock } from "react-icons/bs";
import Container from "../components/Container";

const Header = () => {
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [addresses, setAddresses] = useState([
    "Gülüm Sk. No: 34 Karadolap Mah. Istanbul",
    "1638. Sk. 2a Koza Mh Istanbul 34538",
    "1352. Sk. 1352 sokak Örnek Istanbul 34517"
  ]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleAddAddress = () => {
    if (address) {
      setAddresses([...addresses, address]);
      setSelectedAddress(address);
      setAddress("");
    }
  };

  const handleSearch = () => {
    // Restoran listeleme işlemi burada yapılacak
    console.log("Restoran listele", foodSearch, selectedAddress);
  };

  const estimatedDeliveryTime = "30-45 dk"; // Teslimat süresi algoritması burada olacak

  return (
    <header className="shadow">
      <Container>
        <div className="flex justify-between items-center">
          <Link to={'/'} className="text-3xl font-bold font-mono text-red-500">
            YemekSepeti
          </Link>
          <div className="flex flex-col items-center gap-4 relative w-2/3">
            <div className="flex items-center justify-center w-full gap-2">
              <select
                value={selectedAddress}
                onChange={(e) => handleAddressSelect(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              >
                <option value="" disabled>
                  Teslimat bölgenizi seçin
                </option>
                {addresses.map((addr, index) => (
                  <option key={index} value={addr}>
                    {addr}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="bg-red-500 py-1 px-3 rounded text-white transition hover:bg-red-600 flex items-center"
              >
                <BsFillHouseFill className="inline mr-1" /> Adres
              </button>
              {selectedAddress && (
                <div className="ml-4 text-gray-700 flex items-center">
                  <BsClock className="mr-1" /> 
                  Tahmini Teslimat Süresi: <span className="font-semibold ml-1">{estimatedDeliveryTime}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button className="border border-red-500 py-1 px-2 rounded text-red-500 transition hover:bg-red-500 hover:text-white flex items-center">
              <BsBoxArrowInRight className="mr-1" /> Giriş
            </button>
            <button className="bg-red-500 py-1 px-2 rounded text-white transition hover:bg-red-600 flex items-center">
              <BsPersonPlus className="mr-1" /> Kayıt
            </button>
            <Link
              to={"/cart"}
              className="hover:bg-red-500 hover:bg-opacity-15 rounded-full p-2"
            >
              <BsBasket3 className="text-red-500 text-xl" />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
