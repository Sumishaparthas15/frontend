import toast from "react-hot-toast";
import axios from 'axios';

export default async function Login(e) {
    e.preventDefault(); // Prevent default form submission

    try {
        const response = await axios.post('http://127.0.0.1:8080/api/hospital_login/', {
            email: e.target.email.value,
            password: e.target.password.value
        });

        if (response.status === 200) {
            const data = response.data;
            localStorage.setItem('authToken', JSON.stringify(data));
            toast.success('Login successful!');
            return data;
        } else {
            toast.error('Invalid user credentials!');
            throw new Error("Invalid user credentials");
        }
    } catch (error) {
        toast.error('Invalid user credentials!');
        console.error("Error logging in:", error);
    }
}
