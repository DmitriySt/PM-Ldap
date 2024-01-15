import {FC} from "react";
import { Routes, Route } from "react-router-dom";
import {LoginPage} from "pages/login-page";
import RouterRequireAuth from "router/router-requery-auth";
import {AUTH_LOGIN_PAGE} from "modules/auth";
import {MainPage} from "pages/main-page";



export const Router:FC=()=>{
    return(
        <>
            <Routes>
                <Route path={AUTH_LOGIN_PAGE}  element={<LoginPage/>}/>
                <Route
                    path="/"
                    element={
                    <RouterRequireAuth loginPath={AUTH_LOGIN_PAGE}>
                        <MainPage/>
                    </RouterRequireAuth>
                }>
                </Route>

            </Routes>
        </>
    );
}

