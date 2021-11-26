import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire';

// modules
import auth from './modules/auth';
import chat from './modules/chat';
import settings from './modules/settings';
import ecommerce from './modules/ecommerce';
import mail from './modules/mail';
import sidebar from './modules/sidebar';

import proc_collections from './modules/proc_collections';
import proc_categories from './modules/proc_categories';
import proc_procedures from './modules/proc_procedures';
import proc_users from './modules/proc_users';
import media from './modules/media';

Vue.use(Vuex);

export const store = new Vuex.Store({
    mutations: vuexfireMutations,
    modules: {
        auth,
        chat,
        settings,
        ecommerce,
        mail,
        sidebar,
        proc_users,
        proc_categories,
        proc_collections,
        proc_procedures,
        media
    }
})
