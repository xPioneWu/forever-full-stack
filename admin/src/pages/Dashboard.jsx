import React from 'react';
import { FaUsers, FaShoppingCart, FaBox, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Toplam Kullanıcı</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
            <FaUsers className="text-blue-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Toplam Sipariş</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
            <FaShoppingCart className="text-green-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Toplam Ürün</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
            <FaBox className="text-yellow-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Toplam Gelir</p>
              <h3 className="text-2xl font-bold">₺0</h3>
            </div>
            <FaMoneyBillWave className="text-red-500 text-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 