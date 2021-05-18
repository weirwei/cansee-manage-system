import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
axios.defaults.headers.common['authorization'] = localStorage.getItem('authorization');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded'
const app = createApp(App)
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')
