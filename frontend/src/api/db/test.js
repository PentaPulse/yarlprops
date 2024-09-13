const axios =require('axios');

const add = async () => {
    try {
        const response = await axios.get('http://192.168.8.158:3000/api/data');
        console.log('Data received:', response.data);
    } catch (error) {
        console.error('Error fetching data:');
    }
}

add();
