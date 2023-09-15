import Cookies from 'js-cookie';

// Function to set cookies
const storeToken = (value) => {
    if (value) {
        console.log("Store Token");
        const { access, refresh } = value;
        Cookies.set("access_token", access);
        Cookies.set("refresh_token", refresh);
    }
};

// Function to get cookies
const getToken = () => {
    let access_token = Cookies.get('access_token');
    let refresh_token = Cookies.get('refresh_token');
    return { access_token, refresh_token };
};

// Function to remove cookies
const removeToken = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
};

export { storeToken, getToken, removeToken }