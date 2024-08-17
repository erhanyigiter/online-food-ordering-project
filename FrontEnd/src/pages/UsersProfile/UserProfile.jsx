import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, changePassword } from '../../redux/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setAddress(user.address || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const handleSubmitProfile = (e) => {
    e.preventDefault();

    const updatedProfile = {
      fullName,
      address,
      phoneNumber,
    };

    dispatch(updateUserProfile(updatedProfile))
      .unwrap()
      .then((updatedUser) => {
        setFullName(updatedUser.fullName);
        setAddress(updatedUser.address);
        setPhoneNumber(updatedUser.phoneNumber);
        // Profil güncellendikten sonra Redux state'i güncellemek için profili tekrar çekiyoruz
        return dispatch(fetchUserProfile()).unwrap();
      })
      .then(() => {
        toast.success("Profil güncellendi!");
      })
      .catch(() => {
        toast.error("Profil güncellenemedi!");
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('Yeni şifreler eşleşmiyor!');
      return;
    }

    const passwordData = {
      oldPassword,
      newPassword,
    };

    dispatch(changePassword(passwordData))
      .unwrap()
      .then(() => {
        toast.success("Şifre başarıyla değiştirildi!");
      })
      .catch(() => {
        toast.error("Şifre değiştirilemedi!");
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-red-600 mb-6 text-center">Profilim</h1>
        <form onSubmit={handleSubmitProfile} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Tam Ad:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Adres:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Telefon Numarası:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-150"
          >
            Güncelle
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mt-10">
        <h2 className="text-2xl font-semibold text-red-600 mb-6 text-center">Şifre Değiştir</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Eski Şifre:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Yeni Şifre:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Yeni Şifre (Tekrar):</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-150"
          >
            Şifreyi Değiştir
          </button>
        </form>
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default UserProfile;
