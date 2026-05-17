import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import Logo from "./Logo";
import { useUser } from "../features/authentication/useUser";
import { logout } from "../service/apiAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: "dashboard", label: "Dashboard", to: "/dashboard" },
  { icon: "calendar_month", label: "Bookings", to: "/bookings" },
  { icon: "meeting_room", label: "Cabins", to: "/cabins" },
  { icon: "group", label: "Users", to: "/users" },
  { icon: "settings", label: "Settings", to: "/settings" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();
  const { user, isPending: loadingMetaData, isAdmin } = useUser();
  const {
    fullName: currentFullName,
    avatar: currentAvatar,
    email: userEmail,
  } = user?.user_metadata || {};



    const handleLogout = async () => {
      try {
        await logout();
  
        navigate("/login", { replace: true });
      } catch (error) {
        // toast.error(error.message)
        console.error("Logout failed, but redirecting anyway");
        navigate("/login", { replace: true });
      }
    };
  

  return (
    <aside
      className={`
      fixed xl:static inset-y-0 left-0 z-50
        w-72  bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
      `}
    >
      {/* Close Button - Mobile Only */}
      <button
        onClick={onClose}
        className=" lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Close menu"
      >
        <Icon name="close" size={20} />
      </button>

      {/* Sidebar Logo - desktop */}
      <div className="hidden md:block p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className=" flex items-center justify-center">
            <Logo className="mb-1 mx-auto h-28"/>
          </div>
          <div>
            <h2 className="text-nowrap text-slate-900 dark:text-white">
              Rizz Hotel
            </h2>
            <p className=" text-slate-500 dark:text-slate-400 text-center">
              Management System
            </p>
          </div>
        </div>
      </div>
      {/*Sidebar Logo - mobile */}
      <div className="block md:hidden p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center gap-1">
          <div className="size-39 flex items-center justify-center">
            <Logo className="mb-1 mx-auto" />
          </div>
          <div>
            <h1 className=" text-slate-900 dark:text-white">Rizz Hotel</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose} // Close sidebar on navigation (mobile)
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile - Desktop Only */}
      <div className="block absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg ">
          <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            {/* <div
              className="w-full h-full object-cover"
              style={{ backgroundImage: `url(https://i.pravatar.cc/48)` }}
            ></div> */}
             <NavLink to="/account">
              <img
              src={currentAvatar}
              alt={currentFullName}
              className="w-full h-full object-cover"
            />
             </NavLink>
           
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate capitalize">
              {currentFullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
              {isAdmin ? " Administrator" : "Staff"}
            </p>
          </div>
          <button onClick={handleLogout}  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
            <Icon name="logout" size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}
