import { firestoreAction } from "vuexfire";
import { dbProcCategoriesRef } from "@/firebase";

const state = {
    categories:[]
}

const getters = {
    getProcCategories:(state) => state.categories
}

const mutations = {

}

const actions = {
    setProcCategoriesRefDoc: firestoreAction((context, payload) => {
        return context.bindFirestoreRef('categories', dbProcCategoriesRef.doc(payload.id))
    }),
    
    setProcCategoriesRef: firestoreAction(context=>{
        return context.bindFirestoreRef('categories', dbProcCategoriesRef)
    }),
    addProcCategories: async(context, categorie) => {
        try{
            await dbProcCategoriesRef.add(categorie)

        }catch(error){
            alert(`Error creatin new category. ${error}`)
        }
    },
    deleteProcCategories: async(context, id) =>{
        try{
            const categorie = await dbProcCategoriesRef.doc(id)
            categorie.delete()

        }catch(error){
            alert(`Error removeing category. ${error}`)
        }
    },
    updateProcCategories: async(context, data) =>{
        try{
            const categorie = await dbProcCategoriesRef.doc(data.id)
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