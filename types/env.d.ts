/// <reference types="vite/client"/>

interface ImportMetaEnv {
  // 每添加一次新的环境变量，都需要在这里声明
  // 在代码中通过 import.meta.env 访问环境变量就有ts语法提示
  readonly VITE_APP_API_BASEURL: string;
  readonly VITE_APP_MOCK_BASEURL: string;
  readonly VITE_APP_USE_MOCK: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
