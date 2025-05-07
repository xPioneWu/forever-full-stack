import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { FaSync, FaUser, FaUserShield } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Oturum anahtarı bulunamadı. Lütfen tekrar giriş yapın.");
        return;
      }
      
      const response = await axios.get(`${backendUrl}/api/user/list`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message || "Kullanıcılar yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Kullanıcı listeleme hatası:", error);
      toast.error("Kullanıcılar yüklenirken bir hata oluştu: " + (error.response?.data?.message || error.message));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kullanıcılar</h1>
        <button 
          onClick={fetchUsers} 
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          <FaSync className={`${loading ? 'animate-spin' : ''}`} size={14} />
          <span>Yenile</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {user.profilePic ? (
                          <img className="h-10 w-10 rounded-full" src={user.profilePic} alt="" />
                        ) : (
                          <FaUser className="text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'İsimsiz Kullanıcı'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.createdAt ? formatDate(user.createdAt) : 'Bilinmiyor'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.isAdmin ? (
                        <>
                          <FaUserShield className="mr-1" /> Admin
                        </>
                      ) : 'Kullanıcı'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-8 text-center'>
          <p className='text-gray-600 mb-4'>Henüz hiç kullanıcı bulunmamaktadır.</p>
        </div>
      )}
    </div>
  );
};

export default Users; 