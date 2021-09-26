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
import CalendarPage from "../pages/auth/Videhome_calendar";
import PaymentPage from '../pages/auth/Videhome_payment';
import CurrencyPage from '../pages/auth/Videhome_currency';
import RankingPage from "../pages/auth/Videhome_ranking";
import LecturePage from "../pages/auth/Videhome_video";
import ProcessInfoPage from "../pages/auth/Videhome_process_info";


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
        path: '/calendar',
        exact: true,
        component: CalendarPage,
        name: 'Calendar Page',
        protected: false
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
        name: '주문누적 현황',
        protected: false
    },
    {
        path: '/payment',
        exact: true,
        component: PaymentPage,
        name: '송금확인',
        protected: false
    },
    {
        path: '/currency',
        exact: true,
        component: CurrencyPage,
        name: '시세',
        protected: true
    },
    {
        path: '/ranking',
        exact: true,
        component: RankingPage,
        name: '고객랭킹',
        protected: true
    },
    {
        path: '/video_lecture',
        exact: true,
        component: LecturePage,
        name: '교육영상',
        protected: true
    },
    {
        path: '/process_info',
        exact: true,
        component: ProcessInfoPage,
        name: '매입절차',
        protected: true
    },
    {
        path: '/customer_list',
        exact: true,
        component: CustomerListPage,
        name: '고객리스트',
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
