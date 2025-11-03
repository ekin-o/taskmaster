import { useEffect, useState, type FormEvent } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { authApi, USER_CACHE_KEY } from "../services/auth";

// From MUI login template
export default function LogIn() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const { useLoginMutation, useIsActiveQuery } = authApi;
  const [login, { isSuccess }] = useLoginMutation({ fixedCacheKey: "login" });
  const { isSuccess: isSignedIn } = useIsActiveQuery({ fixedCacheKey: USER_CACHE_KEY });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    login({
      userName: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };
  useEffect(() => {
    if (isSuccess || isSignedIn) navigate("/");
  }, [isSuccess, isSignedIn]);

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };
  return (
    <MuiCard
      variant="outlined"
      sx={{
        justifyContent: "center",
        alignContent: "center",
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        width: "100%",
        height: "100%",
        padding: 4,
        gap: 2,
        margin: "auto",
        marginTop: "10%",
        maxWidth: 400,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          Sign in
        </Button>
      </Box>
    </MuiCard>
  );
}
