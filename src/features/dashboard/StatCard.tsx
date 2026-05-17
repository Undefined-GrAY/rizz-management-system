import { Icon } from "../../ui/Icon";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4  shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
            {title}
          </p>
          <p className="small font-bold text-slate-900 dark:text-white truncate">
            {value}
          </p>
        </div>
        <div
          className={`size-10 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}
        >
          <Icon
            name={icon}
            size={16}
            className={`${iconColor} sm:w-6 sm:h-6 -mb-2 -mr-2`}
          />
        </div>
      </div>
    </div>
  );
}
