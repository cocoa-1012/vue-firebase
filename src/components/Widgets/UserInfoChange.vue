<template>
  <div>
    <v-container fluid grid-list-xl py-0>
      <app-card>
        <v-form v-model="form2.valid" ref="form" lazy-validation>
          <v-text-field
            label="Username"
            v-model="form2.name"
            :rules="form2.nameRules"
            :counter="10"
            required
          ></v-text-field>
          <v-text-field
            label="E-mail ID"
            v-model="form2.email"
            :rules="form2.emailRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>
          <v-checkbox
            label="Do you agree?"
            v-model="form2.checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            required
          ></v-checkbox>
          <v-btn
            @click="submit"
            :disabled="!form2.valid"
            color="success"
            class="mr-3"
          >
            Change
          </v-btn>
          <v-btn @click="clear" color="primary">{{
            $t("message.clear")
          }}</v-btn>
        </v-form>
      </app-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form1: {
        valid: false,
        name: "",
        nameRules: [
          (v) => !!v || "Name is required",
          (v) => v.length <= 10 || "Name must be less than 10 characters",
        ],
        email: "",
        emailRules: [
          (v) => !!v || "E-mail is required",
          (v) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "E-mail must be valid",
        ],
      },
      form2: {
        valid: true,
        name: "",
        nameRules: [
          (v) => !!v || "Name is required",
          (v) =>
            (v && v.length <= 10) || "Name must be less than 10 characters",
        ],
        email: "",
        emailRules: [
          (v) => !!v || "E-mail is required",
          (v) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "E-mail must be valid",
        ],
        select: null,
        // items: ["Item 1", "Item 2", "Item 3", "Item 4"],
        checkbox: false,
      },
    };
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        console.log("form submit");
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
