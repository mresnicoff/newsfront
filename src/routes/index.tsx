import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import Form from "../Form";
import MostrarNotas from "../MostrarNotas.tsx";
import LayoutPublic from "../layout/LayOutPublic.tsx";
import NoticiaDetalle from "../Components/NoticiaDetalle.tsx";
import LoginForm from "../Components/LoginForm.tsx";
import RegisterForm from "../Components/Registrarse.tsx";
import Logout from "../Components/Logout.tsx";
import  ProtectedRoute from"../Components/ProtectedRoute.tsx"
import SearchForm from "../Components/SearchForm.tsx";
import ForgotPasswordForm from "../Components/ForgotPassword.tsx";
import ResetPasswordForm from "../Components/ResetPassword.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LayoutPublic />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/notas",
        element: <MostrarNotas />,
      },
      // Envolvemos la ruta "redactar" con ProtectedRoute
      {
        path: "/redactar",
        element: (
          <ProtectedRoute>
            <Form />
          </ProtectedRoute>
        ),
      },
      {
        path: "/loguearse",
        element: <LoginForm/>,
      },
      {
        path: "/logout",
        element: <Logout/>,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordForm/>,
      },
      {
      path: "/reset-password",
      element: <ResetPasswordForm/>,
    },
      {
        path: "/registrarse",
        element: <RegisterForm/>,
      },
      {
        path: "/noticia/:id",
        element: <NoticiaDetalle />,
      },
      {
        path: "/buscar",
        element: <SearchForm />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);


