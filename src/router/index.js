import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/advertisements",
    name: "advertisements",
    component: () =>
      import(
        /* webpackChunkName: "advertisements" */ "@/views/AdvertisementsView"
      ),
    meta: {
      auth: true,
      roles: [1, 2],
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/LoginView"),
  },
  {
    path: "/publishers",
    name: "publishers",
    component: () =>
      import(/* webpackChunkName: "publishers" */ "@/views/PublishersView"),
    meta: {
      auth: true,
      roles: [1],
    },
  },
  {
    path: "/admin-users",
    name: "admins",
    component: () =>
      import(/* webpackChunkName: "adminUsers" */ "@/views/AdminUsersView"),
    meta: {
      auth: true,
      roles: [1],
    },
  },
  {
    path: "/change-password",
    name: "changePassword",
    component: () =>
      import(
        /* webpackChunkName: "changePassword" */ "@/views/ChangePasswordView"
      ),
    meta: {
      auth: true,
      roles: [1, 2],
    },
  },
];

export const rolesMap = [
  {
    role: "Admin",
    id: 1,
    redirect: "publishers",
  },
  {
    role: "Publisher",
    id: 2,
    redirect: "advertisements",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (!store.getters["auth/authenticated"]) {
    if (to.name !== "login") {
      next({ name: "login" });
    }
    next();
  } else {
    const userRole = rolesMap.find((e) => e.id === store.getters["auth/role"]);
    if (to.matched.some((record) => record.meta.auth)) {
      if (from.name !== to.name) {
        let userHasRight = validateUserPermissions(to, userRole);
        if (!userHasRight) {
          next({ name: userRole.redirect });
        }
        next();
      }
    } else {
      next({ name: userRole.redirect });
    }
  }
});

function validateUserPermissions(to, userRole) {
  let final = false;
  routes.forEach((route) => {
    if (route.name === to.name && route.name !== "login") {
      if (route.meta.roles.includes(userRole.id)) final = true;
    } else if (route.to === "login") {
      final = true;
    }
  });
  return final;
}

export default router;
