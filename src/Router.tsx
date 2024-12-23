import { createBrowserRouter } from "react-router-dom";
import Layout from "./App";
import Calender from "./pages/Calender";
import Home from "./pages/Home";
import CalenderDate from "./pages/CalenderEntries";

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ path: '/', element: <Home /> },
			// { path: '/create', element: <CreateNoteDrawer /> },
			{ path: '/calendar', element: <Calender /> },
			{ path: '/calendar/:date', element: <CalenderDate /> },
			{ path: '/profile', element: 'profile' },
			{ path: '/galery', element: 'tracker' },
			{ path: '/tags', element: 'tracker' },
			{ path: '/maps', element: 'tracker' },
		],
	},
]);
