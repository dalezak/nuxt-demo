export default defineAppConfig({
  name: "Nuxt",
  description: "Nuxt hybrid blueprint",
  theme: "default",
  dark: false,
  links: [
    {
      name: "home",
      label: "Home",
      path: "/home",
      icon: "home"
    },
    {
      name: "products",
      label: "Products",
      path: "/products",
      icon: "shirtOutline"
    },
    {
      name: "posts",
      label: "Posts",
      path: "/posts",
      icon: "chatboxOutline"
    },
    {
      name: "profile",
      label: "Profile",
      path: "/profile",
      icon: "person"
    }
  ]
})