export default defineAppConfig({
  name: "Demo",
  description: "Nuxt Demo",
  theme: "default",
  dark: true,
  tabs: [
    {
      name: "home",
      label: "Home",
      path: "/home",
      icon: "home",
      auth: false
    },
    {
      name: "login",
      label: "Login",
      path: "/login",
      icon: "key",
      auth: false
    },
    {
      name: "products",
      label: "Products",
      path: "/products",
      icon: "shirtOutline",
      auth: true
    },
    {
      name: "posts",
      label: "Posts",
      path: "/posts",
      icon: "chatboxOutline",
      auth: true
    },
    {
      name: "profile",
      label: "Profile",
      path: "/profile",
      icon: "person",
      auth: true
    }
  ]
})