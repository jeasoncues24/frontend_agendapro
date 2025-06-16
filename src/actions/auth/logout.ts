'use client';

import Cookies from 'js-cookie';

export const logout = () => {
    Cookies.remove('authtoken');
    Cookies.remove('user');
    
    localStorage.removeItem('userInfo');
    
    window.location.href = '/auth/login';
}; 