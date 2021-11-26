import Vue from 'vue'
import Router from 'vue-router'

//routes
import defaultRoutes from './default';


// session components
const SignUpOne = () => import('@/views/session/SignUpOne');
const LoginOne = () => import('@/views/session/LoginOne');
const ForgotPassword = () => import('@/views/session/ForgotPassword');
const ResetPassword = () => import('@/views/session/ResetPassword');


Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		defaultRoutes,
		{
			//#PU6
			path: '/sign-up',
			component: SignUpOne,
			meta: {
				title: 'message.signUp',
				breadcrumb: null
			}
		},
		{
			//#PU7
			path: '/login',
			component: LoginOne,
			meta: {
				title: 'message.login',
				breadcrumb: null
			}
		},
		{
			//#PU8
			path: '/forgot-password',
			component: ForgotPassword,
			meta: {
				title: 'message.forgotPassword',
				breadcrumb: null
			}
		},
		{
			//#PU9
			path: '/reset-password',
			component: ResetPassword,
			meta: {
				title: 'message.resetPassword',
				breadcrumb: null
			}
		}
	]
})
