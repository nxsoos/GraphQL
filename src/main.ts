import { createLoginUI } from './login';
import { fetchUserData } from './userdata';
import { displayUserInfo } from './display';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        createLoginUI();
    } else {
        const userData = await fetchUserData();
        displayUserInfo(userData);
    }
});
