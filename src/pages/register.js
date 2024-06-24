import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/react-hooks";
import { Link, useNavigate } from "react-router-dom";
import { REGISTER_USER } from '../mutations/registerMutation';

import { TextField, Button, Container, Stack, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Register = (props) => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const context = useContext(AuthContext);
    let navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    const validateForm = (values) => {
        const errors = [];
        if (!validateEmail(values.email)) {
            errors.push({ message: "Invalid email format" });
        }
        if (values.password.length < 8) {
            errors.push({ message: "Password must be at least 8 characters long" });
        }
        if (values.password !== values.confirmPassword) {
            errors.push({ message: "Passwords do not match" });
        }
        return errors;
    }

    const registerUserCallback = () => {
        const validationErrors = validateForm(values);
        if (validationErrors.length === 0) {
            registerUser();
        } else {
            setErrors(validationErrors);
        }
    }

    const {onChange, onSubmit, values} = useForm(registerUserCallback, {
        username : '',
        email : '',
        password : '',
        confirmPassword : ''
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const [registerUser] = useMutation(REGISTER_USER, {
        update(proxy, {data: {registerUser: userData}}){
            context.login(userData);
            navigate('/facility-management');
        },
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables: { registerInput: values}
    })
    return (
        <Container spacing={2} maxWidth="sm">
            <h3>Register</h3>
            <p>This is the register page, register below to create an account!!</p>
            <Stack spacing={2} paddingBottom={2}>
                <TextField
                    label="Username"
                    name="username"
                    onChange={onChange}
                />
                 <TextField
                    label="Email"
                    name="email"
                    onChange={onChange}
                />
                 <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    helperText={'Password should be atleast 8 characters long.'}
                    onChange={onChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Confirm password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    helperText={'Password should be atleast 8 characters long.'}
                    onChange={onChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowConfirmPassword}>
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            {errors.map((error) => {
                return (
                    <Alert severity="error">
                        {error.message}
                    </Alert>
                )
            })}
            <Button variant="contained" onClick={onSubmit}>Register</Button>
            <Link to="/login" style={{marginLeft: '10px'}}> Back to login </Link>
        </Container>
    )

}


export default Register;