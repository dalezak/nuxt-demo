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
      public: true
    },
    {
      name: "login",
      label: "Login",
      path: "/login",
      icon: "key",
      public: true
    },
    {
      name: "products",
      label: "Products",
      path: "/products",
      icon: "shirtOutline",
      public: false
    },
    {
      name: "posts",
      label: "Posts",
      path: "/posts",
      icon: "chatboxOutline",
      public: false
    },
    {
      name: "profile",
      label: "Profile",
      path: "/profile",
      icon: "person",
      public: false
    }
  ]
})