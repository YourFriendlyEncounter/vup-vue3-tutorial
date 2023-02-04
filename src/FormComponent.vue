<script setup lang="ts">
import * as yup from "yup";
import { ref } from "vue";
import { validateSchema } from "./utils";
import type { IValidationErrorSchema } from "./types";

const user = ref({
  name: "",
  email: "example.com",
  password: "123456",
});

const errorSchema = ref<IValidationErrorSchema>({});
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required."),
  email: yup.string().required("Email is required.").email("Email is not valid."),
  password: yup
      .string()
      .required("Please enter your password.")
      .matches(new RegExp("[0-9a-zA-Z]$"))
      .min(8),
});

const handleSubmit = async () => {
  // Clear the errors.
  errorSchema.value = {};
  // Validate and get errors.
  const { isValid, errors } = await validateSchema(validationSchema, user.value);

  if (!isValid) {
    errorSchema.value = errors;
    return;
  }

  alert("The form is valid!");
}
</script>

<template>
  <form class="form-component" @submit.prevent="handleSubmit">
    <input type="text" v-model="user.name" placeholder="Name" :class="{ error: errorSchema.name }">
    <p class="error">{{ errorSchema.name }}</p>
    <input type="text" v-model="user.email" placeholder="Email" :class="{ error: errorSchema.email }">
    <p class="error">{{ errorSchema.email }}</p>
    <input type="password" v-model="user.password" placeholder="Password" :class="{ error: errorSchema.password }">
    <p class="error">{{ errorSchema.password }}</p>
    <button type="submit">Confirm!</button>
  </form>
</template>

<style>
.form-component > .error {
  color: red;
}

.form-component > input.error {
  border-color: red;
}
</style>
