import { firestoreAction } from "vuexfire";
import { dbProcUsersRef } from "@/firebase";

const state = {
    users:[]
}

const getters = {
    getProcUsers:(state) => state.users
}

const mutations = {

}

const actions = {
    setProcUsersRefDoc: firestoreAction((context, payload) => {
        return context.bindFirestoreRef('users', dbProcUsersRef.doc(payload.id))
    }),
    
  /*  setProcUsersRef: firestoreAction(context=>{
        return context.bindFirestoreRef('users', dbProcUsersRef)
    }),*/
    addProcUsers: async(context, categorie) => {
        try{
            await dbProcUsersRef.add(categorie)

        }catch(error){
            alert(`Error creatin new category. ${error}`)
        }
    },
    deleteProcUsers: async(context, id) =>{
        try{
            const categorie = await dbProcUsersRef.doc(id)
            categorie.delete()

        }catch(error){
            alert(`Error removeing category. ${error}`)
        }
    },
    updateProcUsers: async(context, data) =>{
        try{
            const categorie = await dbProcUsersRef.doc(data.id)
            categorie.update(data)

        }catch(error){
            alert(`Error updating category. ${error}`)
        }
    }
    
}

export default {
     state,
     mutations,
     getters,
     actions
}