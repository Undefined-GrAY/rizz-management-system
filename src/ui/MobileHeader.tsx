import { matchPath, NavLink, useLocation } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { DarkModeToggle } from "./Darkmodetoggle";
import Logo from "./Logo";
import { Button } from "./Button";
import { useUser } from "../features/authentication/useUser";

interface MobileHeaderProps {
  // title?: string;
  // description?: string;
  // showBackButton?: boolean;
  onBack?: () => void;
  onMenuClick?: () => void;
}

export function MobileHeader({
  onMenuClick, onBack
}: MobileHeaderProps) {
  const { pathname } = useLocation();
  //specically for boooking details only
  const isPath = matchPath("/bookings/:bookingId", pathname);


    const { user, isPending: loadingMetaData, isAdmin } = useUser();
    const {
      fullName: currentFullName,
      avatar: currentAvatar,
      email: userEmail,
    } = user?.user_metadata || {};
  return (
    <header className="xl:hidden sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between py-3 px-4  md:py-5 md:px-8">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {isPath ? (
            <Button variant="ghost" onClick={onBack} className=" hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Icon name="arrow_back" size={20} />
            </Button>
          ) : (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open menu"
            >
              <Icon name="menu" size={32} />
            </button>
          )}

          {/* logo md */}
          <div className="hidden md:flex gap-2">
            <div className=" flex ">
              <Logo className="h-8" />
            </div>
            <span className="mt-2 md:mt-1 font-bold text-lg md:text-2xl text-slate-900 dark:text-white ">
              Rizz Hotel
            </span>
          </div>
        </div>
        {/* {mobile logo is hidden when in tab mode} */}
        <Logo className="size-8 md:hidden" />

        {/* Right: Dark Mode + Profile */}
        <div className="flex xl:hidden items-center justify-center gap-6">
          <DarkModeToggle />
          <NavLink to="/account">
            <div className="profile flex gap-4 items-center">
              {/* {image and name} */}
              <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden lg:order-1">
                {/* <div
                  className="w-full h-full object-cover"
                  style={{ backgroundImage: `url(https://i.pravatar.cc/48)` }}
                ></div> */}
                 <img
                  src={currentAvatar}
                  alt={currentFullName}
                  className="w-full h-full object-cover"/>
              </div>
              <span className="hidden lg:block lg:order-0">
                {currentFullName}
              </span>
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
