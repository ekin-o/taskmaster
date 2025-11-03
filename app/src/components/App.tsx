import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Divider,
  AppBar as MUIAppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import Lists from "./TaskList";
import Tasks from "./Tasks";
import { authApi, USER_CACHE_KEY } from "../services/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { listsApi } from "../services/lists";
import { tasksApi } from "../services/tasks";
function App() {
  const [currentListId, setCurrentListId] = useState<number | null>(null);

  const { useLoginMutation, useIsActiveQuery, useLogoutMutation } = authApi;
  const [logout, { isSuccess: isLogoutSuccess }] = useLogoutMutation({
    fixedCacheKey: "logout",
  });
  const [__, { isSuccess: isLoginSuccess }] = useLoginMutation({
    fixedCacheKey: "login",
  });
  const { data, isError } = useIsActiveQuery({ fixedCacheKey: USER_CACHE_KEY });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogoutSuccess) {
        dispatch(authApi.util.resetApiState());
        dispatch(listsApi.util.resetApiState());
        dispatch(tasksApi.util.resetApiState());
    };
    if (isError) navigate("/login");
  }, [isLogoutSuccess, isError]);

  if (isLoginSuccess || !isError) {
    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <MUIAppBar position="static">
            {data && (
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {`Hello, ${data?.firstName} ${data?.lastName}`}
                </Typography>
                <Button
                  size="large"
                  onClick={() => {
                    logout({});
                  }}
                  color="inherit"
                >
                  Log out
                </Button>
              </Toolbar>
            )}
          </MUIAppBar>
        </Box>
        <Stack direction="row" sx={{ height: "85vh", width: "100vw" }}>
          {/* Left Panel */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Lists
              setCurrentListId={setCurrentListId}
              currentListId={currentListId}
            />
          </Box>
          <Divider orientation="vertical" />
          {/* Right Panel */}
          <Box
            sx={{
              flex: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentListId && <Tasks list={currentListId} />}
          </Box>
        </Stack>
      </>
    );
  }
}

export default App;
