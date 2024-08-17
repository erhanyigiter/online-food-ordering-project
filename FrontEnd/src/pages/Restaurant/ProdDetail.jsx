import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { FaFireAlt } from 'react-icons/fa'; // Değiştirildi
import Card from './Card';

const ProdDetail = () => {
  const { isLoading, products, restaurant, noProductsFound } = useSelector(
    (store) => store.product
  );

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {products.length === 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-red-500">
                Ürün Bulunamadı
              </h2>
              <p className="text-gray-600">
                Bu restorana ait ürün bulunmamaktadır.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold flex gap-2 items-center">
                <FaFireAlt className="text-red-500" /> 
                Popüler
              </h2>
  
              <p className="text-gray-600">
                Restoranın en çok tercih edilen ürünleri
              </p>
  
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.name || 'Ürün Adı Belirtilmemiş',  // Varsayılan değer
                      desc: product.description || 'Açıklama bulunmuyor', // Varsayılan değer
                      price: product.price || 0, // Varsayılan değer
                      photo: product.photo || 'default.jpg', // Varsayılan değer, resim yoksa varsayılan
                      restaurantName: restaurant?.name || 'Restoran Adı Belirtilmemiş' // Varsayılan değer
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProdDetail;
