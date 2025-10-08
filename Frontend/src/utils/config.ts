
const CONFIG = {
  DEVELOPMENT: {
    BACKEND_URL: "http://127.0.0.1:9888",
  },    
  PRODUCTION: {
    BACKEND_URL: "",
  },
};

const ENV = __DEV__ ? CONFIG.DEVELOPMENT : CONFIG.PRODUCTION;

export default ENV;
