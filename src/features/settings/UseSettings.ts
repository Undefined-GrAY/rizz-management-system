import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../service/apiSettings";

export default function UseSettings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    retry: false,
  });
  return { settings, isLoading };
}
