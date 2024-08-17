import React from 'react';

const isLogin = ({ data, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <img src={data.photo} alt={data.name} className="w-full h-32 object-cover rounded-t-lg" />
      <div className="mt-2">
        <h2 className="text-lg font-semibold">{data.name}</h2>
        <p className="text-gray-500">{data.address}</p>
      </div>
    </div>
  );
};

export default isLogin;
