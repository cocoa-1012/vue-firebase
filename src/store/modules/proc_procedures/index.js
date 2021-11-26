import Vue from 'vue'
import { firestoreAction } from "vuexfire";
import { db, dbProcProceduresRef, firebase, dbProcUsersRef } from "@/firebase";
import { getListIdInOrder } from "@/helpers/helpers"

const state = {

    //lista de todas as procedures
    procedures: [],

    //lista de atividades
    activities: [],

    //lista de fases
    phases: [],

    //lista de fases em ordem
    phasesQueueIdOrdered: [],
}

const getters = {
    getProcProcedures: (state) => state.procedures,
    getProcProceduresActivities: (state) => state.activities,
    getProcProceduresPhases: (state) => state.phases,
}

const mutations = {
    init (state) {
        state.procedures = [];
        state.activities = [];
        state.phases = [];
        state.phasesQueueIdOrdered = [];
    }
}

const actions = {

    //TODO #1 Desmembrar consulta por activities no store de Procedures, criando novo modulo para activities
    setProcProcedureRefDoc: firestoreAction((context, payload) => {
        context.bindFirestoreRef('activities', dbProcProceduresRef.doc(payload.id).collection('activities').orderBy("order"))
        context.bindFirestoreRef('phases', dbProcProceduresRef.doc(payload.id).collection('phases').orderBy("order"))
        context.bindFirestoreRef('procedures', dbProcProceduresRef.doc(payload.id)).then(() => {
            getListIdInOrder(state.phases, state.phasesQueueIdOrdered, state.phases.filter(function (n) { return n.parent == null; })[0]);
        });

        return;
    }),
    setProcProcedureRefWhere: firestoreAction((context, payload) => {
        if (!payload.slug) {
            context.commit('init');
        } else {
            let procedure = dbProcProceduresRef.where('slug', '==', payload.slug);
            procedure.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    context.bindFirestoreRef('activities', dbProcProceduresRef.doc(doc.id).collection('activities').orderBy("order"));
                    context.bindFirestoreRef('phases', dbProcProceduresRef.doc(doc.id).collection('phases'));
                    context.bindFirestoreRef('procedures', dbProcProceduresRef.doc(doc.id));

                });
            }).then(() => {
                getListIdInOrder(state.phases, state.phasesQueueIdOrdered, state.phases.filter(function (n) { return n.parent == null; })[0]);
            });
        }


        return;

    }),
    setProcProcedureRef: firestoreAction(context => {

        // recover uid user in localstorage
        const uid = JSON.parse(localStorage.getItem('user')).uid;

        // User Reference
        var reference = dbProcUsersRef.doc(uid);

        context.bindFirestoreRef('procedures', dbProcProceduresRef.where("owner", "==", reference)).then(() => {
            getListIdInOrder(state.phases, state.phasesQueueIdOrdered, state.phases.filter(function (n) { return n.parent == null; })[0]);
        });

        return;

    }),
    addProcProcedure: async (context, procedure) => {

        var procedure_insert = procedure


        console.log(procedure)

        let user = firebase.auth().currentUser;

        if (procedure.proc_collections != "") {
            procedure_insert.proc_collections = db.collection('PROC_Collections').doc(procedure.proc_collections);
        } else {
            procedure_insert.proc_collections = "";
        }

        procedure_insert.proc_categories = db.collection('PROC_Categories').doc(procedure.proc_categories);
        procedure_insert.createAt = firebase.firestore.FieldValue.serverTimestamp();
        procedure_insert.owner = dbProcUsersRef.doc(user.uid)
        // procedure_insert.slug = uuidv1();
        // if (typeof procedure_insert.name == 'undefined') {
        //     let uuid = require("uuid");
        //     procedure_insert.slug = uuid.v1();
        // } else {
        //     procedure_insert.slug = slugify(procedure_insert.name)
        // }


        try {

            console.log('okok');
            console.log(procedure_insert)
            await dbProcProceduresRef.add(procedure_insert)

            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Procedimento inserido com sucesso!'
            });

        } catch (error) {
            alert(`Error creatin new procedure. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao inserir procedimento!'
            });
        }
    },
    deleteProcProcedure: async (context, id) => {
        try {
            const procedure = await dbProcProceduresRef.doc(id)
            procedure.delete()


            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Procedimento excluído com sucesso!'
            });

        } catch (error) {
            alert(`Error removeing procedure. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao excluir procedimento!'
            });
        }
    },
    updateProcProcedure: async (context, data) => {

        try {

            if (typeof data.proc_collections === "string") {
                data.proc_collections = db.collection('PROC_Collections').doc(data.proc_collections);
            }

            if (typeof data.proc_categories === "string") {
                data.proc_categories = db.collection('PROC_Categories').doc(data.proc_categories);
            }
            let user = firebase.auth().currentUser;
            data.owner = dbProcUsersRef.doc(user.uid)
            const procedure = await dbProcProceduresRef.doc(data.id);
            procedure.update(data);

            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Procedimento atualizado com sucesso!'
            });

        } catch (error) {
            alert(`Error updating procedure. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao atualizar procedimento!'
            });
        }
    },

    setProcProcedureActivitiesRefDoc: firestoreAction((context, payload) => {
        return context.bindFirestoreRef('activities', dbProcProceduresRef.doc(payload.procedure_id).collection('activities'))
    }),
    addAction: async (context, data) => {

        try {
            console.log("Addaction/data : ", data);
            if (data.phase == 'DEFAULT') {
                const phases = await dbProcProceduresRef.doc(data.procedure_id).collection('phases').doc(data.phase);
                console.log("DATAPHASE", phases)
                await phases.set({
                    name: 'DEFAULT'
                });
            } else {
                data.phase = await dbProcProceduresRef.doc(data.procedure_id).collection('phases').doc(data.phase);
            }

            const action = await dbProcProceduresRef.doc(data.procedure_id).collection('activities');
            delete data.procedure_id
            action.add(data);

            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Atvidade inserida com sucesso!'
            });

        } catch (error) {
            alert(`Error add action. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao inserir Atvidade!'
            });
        }
    },
    updateAction: async (context, data) => {
        try {


            if (data.phase != 'DEFAULT') {
                data.phase = await dbProcProceduresRef.doc(data.procedure_id).collection('phases').doc(data.phase);
            }

            const action = await dbProcProceduresRef.doc(data.procedure_id).collection('activities').doc(data.id);
            delete data.procedure_id
            action.update(data)


            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Atividade atualizado com sucesso!'
            });

        } catch (error) {
            alert(`Error updating procedure. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao atualizar Atividade!'
            });
        }
    },
    deleteAction: async (context, data) => {
        try {
            const action = await dbProcProceduresRef.doc(data.procedure_id).collection('activities').doc(data.id);
            action.delete()


            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Atvidade excluída com sucesso!'
            });

        } catch (error) {
            alert(`Error removeing action. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao excluir Atvidade!'
            });
        }
    },
    duplicateAction: async (context, data) => {

        try {
            let docForDuplicate = {};

            const actionForDuplicate = await dbProcProceduresRef.doc(data.procedure_id).collection('activities').doc(data.id);
            const action = await dbProcProceduresRef.doc(data.procedure_id).collection('activities');

            await actionForDuplicate.get().then(doc => { docForDuplicate = doc.data() });
            delete docForDuplicate.id

            docForDuplicate.order = data.order;

            action.add(docForDuplicate)

            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Atvidade duplicada com sucesso!'
            });

        } catch (error) {
            alert(`Error add action. ${error}`)


            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao duplicar Atvidade!'
            });
        }
    },

    addPhase: async (context, data) => {



        try {

            data.parent = '123'

            //const phase1 = await dbProcProceduresRef.doc(data.procedure_id).collection('phases');

            // let topParent = dbProcProceduresRef.doc(data.procedure_id).collection('phases').whereEqualTo("parent", null).get();

            const phase = await dbProcProceduresRef.doc(data.procedure_id).collection('phases');
            delete data.procedure_id
            phase.add(data)

            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Fase inserida com sucesso!'
            });

        } catch (error) {
            alert(`Error add phase. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao inserir Fase!'
            });
        }
    },
    deletePhase: async (context, data) => {
        try {
            const phase = await dbProcProceduresRef.doc(data.procedure_id).collection('phases').doc(data.id);
            phase.delete()

            Vue.notify({
                group: 'loggedIn',
                type: 'success',
                text: 'Fase excluída com sucesso!'
            });

        } catch (error) {
            alert(`Error removeing phase. ${error}`)

            Vue.notify({
                group: 'loggedIn',
                type: 'error',
                text: 'Erro ao excluir Fase!'
            });
        }
    },


}

export default {
    state,
    mutations,
    getters,
    actions
}