import { firestoreAction } from "vuexfire";
import { dbMediaRef } from "@/firebase";
import Vue from 'vue'

const state = {
    media:[]
}

const getters = {
    getMedia:(state) => state.media
}

const mutations = {
    addMedia: async(context, path, file) => {

        let firebaseStorageRef = dbMediaRef.child(path); // Get the path of the file
        let uploadTask = firebaseStorageRef.putFile(file); // Ensures that the file is added with its path
        
        try{
            await uploadTask.onComplete
            
        }catch(error){
            alert(`Error creatin new procedure. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao inserir procedimento!'
            });
        }
       
    },
}

const actions = {
    setMediaRefDoc:firestoreAction((context, payload) => {
        return context.bindFirestoreRef('media', dbMediaRef.child(payload.id).getDownloadURL())
    }),
    setMediaRef: firestoreAction(context=>{
        return context.bindFirestoreRef('media', dbMediaRef)
    }),
    updloadMediaRef: firestoreAction(context=>{
        return context.bindFirestoreRef('media', dbMediaRef)
    }),
    deleteMedia: async(context, id) =>{
        try{
            const media = await dbMediaRef.child(id+'.png');
            media.delete()

        }catch(error){
            alert(`Error removeing procedure. ${error}`)
        }
    },

  };


export default {
     state,
     mutations,
     getters,
     actions
}