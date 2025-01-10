import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from './authContext';

export const PrivateRouter = () => {
	const { isAuthenticated } = useAuthContext();

	return isAuthenticated ? <Outlet /> : <Navigate to="auth/signin" />;
};
