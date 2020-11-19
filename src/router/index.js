import Vue from "vue";
import VueRouter from "vue-router";
import { getStorage } from "@/common/utils";
import _ from "lodash";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/Login.vue")
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
        component: () => import("@/views/Admin/Order.vue"),
        meta: {
          admin: true,
          employee: true,
          visitor: false
        }
      }
    ]
  },
  {
    path: "*",
    redirect: "/admin/restaurant"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const role = _.get(getStorage("role"), "role", "");
  console.log(to);
  console.log(from);
  console.log(next);
  console.log("121212", role);
  if (!role && to.name !== "Login") {
    next({ name: "Login" });
  } else if (role == "visitor" && to.name == "Oder") {
    next({ name: "Restaurant" });
  } else {
    next();
  }
});

export default router;
