import IRoute from "../interfaces/route";
import ChangePasswordPage from "../pages/auth/change";
import ForgotPasswordPage from "../pages/auth/forgot";
import LoginPage from "../pages/auth/login";
import LogoutPage from "../pages/auth/logout";
import QRReaderPage from "../pages/auth/QRReader";
import RegisterPage from "../pages/auth/register";
import ResetPasswordPage from "../pages/auth/reset";
import HomePage from "../pages/home";
import RequestConfirmationPage from "../pages/auth/Videhome_requests"
import FinalizingPage from "../pages/auth/Videhome_finalize";
import ConfirmedPage from "../pages/auth/Videhome_confirmedOrder";
import CustomerListPage from "../pages/auth/Videhome_customerList";
import CustomerInfoPage from "../pages/auth/customer_info";

const routes: IRoute[] = [
    {
        path: '/',
        exact: true,
        component: HomePage,
        name: 'Home Page',
        protected: true
    },
    {
        path: '/login/register',
        exact: true,
        component: RegisterPage,
        name: 'Register Page',
        protected: false
    },
    {
        path: '/login',
        exact: true,
        component: LoginPage,
        name: 'Login Page',
        protected: false
    },
    {
        path: '/change',
        exact: true,
        component: ChangePasswordPage,
        name: 'Change Password Page',
        protected: true
    },
    {
        path: '/logout',
        exact: true,
        component: LogoutPage,
        name: 'Logout Page',
        protected: true
    },
    {
        path: '/QR_Reader',
        exact: true,
        component: QRReaderPage,
        name: 'QRREADER Page',
        protected: false
    },
    {
        path: '/requests',
        exact: true,
        component: RequestConfirmationPage,
        name: '신청확인',
        protected: false
    },
    {
        path: '/finalize',
        exact: true,
        component: FinalizingPage,
        name: '매입정산',
        protected: false
    },
    {
        path: '/confirmed',
        exact: true,
        component: ConfirmedPage,
        name: '매입정산',
        protected: false
    },
    {
        path: '/customer_list',
        exact: true,
        component: CustomerListPage,
        name: '고객정보',
        protected: false
    },
    {
        path: '/customer_info',
        exact: true,
        component: CustomerInfoPage,
        name: '고객정보',
        protected: false
    },
    {
        path: '/forget',
        exact: true,
        component: ForgotPasswordPage,
        name: 'Forgot Password Page',
        protected: false
    },
    {
        path: '/reset',
        exact: true,
        component: ResetPasswordPage,
        name: 'Reset Password Page',
        protected: false
    }
];

export default routes;
