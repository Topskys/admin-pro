import { defineStore } from "pinia";
import pinia from "..";
import { login, refreshUserInfo } from "@/api";

export interface IUserState {
  username: string;
  accessToken: string;
  refreshToken?: string;
  roles: string[];
}

export const useUserStoreHook = defineStore("userInfo", {
  state: (): IUserState => ({
    username: "Topskys",
    accessToken: "",
    roles: ["admin"]
  }),
  getters: {
    // TODO: add getters
  },
  actions: {
    // TODO: add actions
    // 用户登录
    storeUserLogin(data) {
      return login(data)
        .then((res) => {
          this.roles = res.roles;
          this.username = res.username;
          this.accessToken = res.accessToken;
          return res;
        })
        .catch((err) => {
          console.log("登录失败", err);
        });
    },
    // 刷新token
    storeRefreshUserInfo() {
      if (this.username == "Topskys" && this.accessToken != "") {
        refreshUserInfo({
          accessToken: this.accessToken
        })
          .then((res) => {
            this.roles = res.roles;
            this.username = res.username;
            this.accessToken = res.accessToken;
            return res;
          })
          .catch(() => {
            this.accessToken = " ";
          });
      }
    }
  },
  // 持久化
  persist: {
    key: "userInfo",
    storage: sessionStorage
    // paths: ["accessToken"],
  }
});

export function useUserStore() {
  return useUserStoreHook(pinia);
}
