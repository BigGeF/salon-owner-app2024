import api from './api';
import { getAuth } from 'firebase/auth';

// 获取业主所有美容院数据
export const getSalonsByOwnerId = async (ownerId: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('用户未登录 / User not logged in');
    }

    try {
        const response = await api.get(`/salons/owner/${ownerId}`)        
        return response.data;
    } catch (error) {
        console.error('Error fetching salons:', error);
        throw new Error('无法获取美容院列表 / Network response was not ok');
    }
};

// 更新指定美容院数据
export const updateSalonById = async (salonId: string, salonData: any) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('用户未登录 / User not logged in');
    }
    try {
        // 发送带有 Firebase ID 令牌的请求
        const response = await api.put(`/salons/${salonId}`, { ...salonData });
        return response.data;
    } catch (error) {
        console.error('Error updating salon:', error);
        throw new Error('无法更新美容院信息 / Network response was not ok');
    }
};

// 添加新的美容院
export const addSalonByOwnerId = async (salonData: any) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not logged in');
    }



    try {
        const response = await api.post('/salons', { ...salonData });
        return response.data;
    } catch (error) {
        console.error('Error adding salon:', error);
        throw new Error(' Network response was not ok');
    }
};
