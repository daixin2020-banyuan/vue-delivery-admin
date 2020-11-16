import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/admin"
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/Admin/Admin.vue"),
    redirect: "/admin/restaurant",
    children: [
      {
        path: "restaurant",
        name: "Restaurant",
        component: () => import("@/views/Admin/Restaurant.vue")
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("@/views/Admin/Menu.vue")
      },
      {
        path: "order",
        name: "Order",
        component: () => import("@/views/Admin/Order.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
