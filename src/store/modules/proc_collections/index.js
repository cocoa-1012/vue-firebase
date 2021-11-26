import { firestoreAction } from "vuexfire";
import { dbProcCollectionsRef } from "@/firebase";

const state = {
    collections:[]
}

const getters = {
    getProcCollections:(state) => state.collections
}

const mutations = {

}

const actions = {
    setProcCollectionsRefDoc: firestoreAction((context, payload) => {
        return context.bindFirestoreRef('collections', dbProcCollectionsRef.doc(payload.id))
    }),
    
    setProcCollectionsRef: firestoreAction(context=>{
        return context.bindFirestoreRef('collections', dbProcCollectionsRef)
    }),
    addProcCollections: async(context, collection) => {
        try{
            await dbProcCollectionsRef.add(collection)

        }catch(error){
            alert(`Error creatin new collection. ${error}`)
        }
    },
    deleteProcCollections: async(context, id) =>{
        try{
            const collection = await dbProcCollectionsRef.doc(id)
            collection.delete()

        }catch(error){
            alert(`Error removeing collection. ${error}`)
        }
    },
    updateProcCollections: async(context, data) =>{
        try{
            const collection = await dbProcCollectionsRef.doc(data.id)
            collection.update(data)

        }catch(error){
            alert(`Error updating collection. ${error}`)
        }
    }
    
}

export default {
     state,
     mutations,
     getters,
     actions
}