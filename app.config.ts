export default defineAppConfig({
  name: "Demo",
  description: "Nuxt Demo",
  theme: "default",
  dark: true,
  pages: [
    {
      name: "home",
      label: "Home",
      path: "/home",
      icon: "home",
      public: true,
      tab: true
    },
    {
      name: "login",
      label: "Login",
      path: "/login",
      icon: "key",
      public: true,
      tab: true
    },
    {
      name: "products",
      label: "Products",
      path: "/products",
      icon: "shirtOutline",
      public: false,
      tab: true
    },
    {
      name: "posts",
      label: "Posts",
      path: "/posts",
      icon: "chatboxOutline",
      public: false,
      tab: true
    },
    {
      name: "profile",
      label: "Profile",
      path: "/profile",
      icon: "person",
      public: false,
      tab: true
    }
  ]
})