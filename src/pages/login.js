import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/react-hooks";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_USER } from '../mutations/loginMutation';
import { TextField, Button, Container, Stack, Alert } from "@mui/material";


const Login = (props) => {
    const context = useContext(AuthContext);
    let navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    
   
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    const loginUserCallback = () => {
        if (validateEmail(values.email)) {
            loginUser();
        } else {
            setErrors([{ message: "Invalid email format" }]);
        }
    }
    
    const {onChange, onSubmit, values} = useForm(loginUserCallback, {
        email : '',
        password : '',
    });

    const [loginUser] = useMutation(LOGIN_USER, {
        update(proxy, {data: {loginUser: userData}}){
            context.login(userData);
            navigate('/facility-management');
        },
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables: { loginInput: values}
    })
    return (
        <Container spacing={2} maxWidth="sm">
            <h3>Please enter your details to login!</h3>
            <Stack spacing={2} paddingBottom={2}>
                 <TextField
                    label="Email"
                    name="email"
                    onChange={onChange}
                />
                 <TextField
                    label="Password"
                    name="password"
                    type="password"
                    onChange={onChange}
                />
            </Stack>
            {errors.map((error) => {
                return (
                    <Alert severity="error">
                        {error.message}
                    </Alert>
                )
            })}
            <Button variant="contained" onClick={onSubmit}>Login</Button>
            <Link to="/register" style={{marginLeft: '10px'}}> Click here to register!! </Link>

        </Container>
    )

}


export default Login;