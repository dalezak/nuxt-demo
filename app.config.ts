export default defineAppConfig({
  name: "Demo",
  description: "Nuxt Layer Demo",
  theme: "default",
  dark: true,
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