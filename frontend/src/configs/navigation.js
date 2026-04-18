import Icons from "../components/icons";

export const UserMenu = [
  {
    title: "Мои материалы",
    href: "/materials/create",
    icon: <Icons.PlusIcon />,
  },
  {
    title: "Избранное",
    href: "/favorites",
    icon: <Icons.FavoritesIcon />,
  },
  {
    title: "Подписки",
    href: "/subscriptions",
    icon: <Icons.SubscriptionsIcon />,
  },
  {
    title: "Сменить пароль",
    href: "/change-password",
    icon: <Icons.PasswordIcon />,
  },
];