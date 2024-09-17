<template>
  <v-container class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="2">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title class="text-h5">
              <v-icon left>mdi-format-list-checkbox</v-icon>
              Liste des Tâches
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="text-center">
            <v-btn
              color="secondary"
              @click="$router.push('/')"
              class="mb-4"
              elevation="1"
            >
              <v-icon left>mdi-home</v-icon>
              Retour à l'Accueil
            </v-btn>
          </v-card-text>

          <v-card-text>
            <v-form @submit.prevent="addTodo">
              <v-text-field
                v-model="newTodo"
                label="Ajouter une nouvelle tâche"
                outlined
                clearable
                prepend-inner-icon="mdi-plus-box"
                hide-details
                dense
              ></v-text-field>
              <v-btn
                color="primary"
                type="submit"
                class="my-4"
                block
                elevation="1"
              >
                Ajouter
              </v-btn>
            </v-form>

            <v-divider class="my-4"></v-divider>

            <v-list>
              <v-slide-y-transition group>
                <v-list-item
                  v-for="todo in todos"
                  :key="todo._id"
                  class="py-2"
                  lines="one"
                  density="comfortable"
                >
                  <template #prepend>
                    <v-checkbox
                      v-model="todo.completed"
                      @change="toggleComplete(todo)"
                      color="primary"
                      class="mt-0"
                      hide-details
                    ></v-checkbox>
                  </template>
                  <v-list-item-content class="d-flex align-center">
                    <template v-if="editingTodoId === todo._id">
                      <v-text-field
                        v-model="todo.text"
                        dense
                        hide-details
                        @keyup.enter="updateTodoText(todo)"
                        @blur="updateTodoText(todo)"
                      ></v-text-field>
                    </template>
                    <template v-else>
                      <v-list-item-title
                        :class="{
                          'text-decoration-line-through text-subtitle-1':
                            todo.completed,
                          'text-subtitle-1': !todo.completed,
                        }"
                      >
                        {{ todo.text }}
                      </v-list-item-title>
                    </template>
                  </v-list-item-content>
                  <template #append>
                    <v-btn
                      icon
                      @click="startEditing(todo._id)"
                      class="mr-2 mt-0"
                      color="blue"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      @click="deleteTodo(todo._id)"
                      class="mr-2 mt-0"
                      color="red"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-slide-y-transition>
            </v-list>

            <v-alert
              v-if="errorMessage"
              type="error"
              dismissible
              class="mt-4 v-alert--dense"
              elevation="2"
              @input="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

export default defineComponent({
  name: "TodoList",
  setup() {
    const newTodo = ref<string>("");
    const todos = ref<Todo[]>([]);
    const errorMessage = ref<string>("");
    const editingTodoId = ref<string | null>(null);

    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/todos");
        todos.value = response.data;
      } catch (error) {
        errorMessage.value =
          "Impossible de récupérer les tâches. Veuillez vérifier le serveur.";
        console.error(error);
      }
    };

    const addTodo = async () => {
      if (newTodo.value.trim()) {
        try {
          const response = await axios.post("http://localhost:5001/api/todos", {
            text: newTodo.value,
          });
          todos.value.push(response.data);
          newTodo.value = "";
        } catch (error) {
          errorMessage.value =
            "Impossible d'ajouter la tâche. Veuillez vérifier le serveur.";
          console.error(error);
        }
      }
    };

    const deleteTodo = async (id: string) => {
      try {
        await axios.delete(`http://localhost:5001/api/todos/${id}`);
        todos.value = todos.value.filter((todo) => todo._id !== id);
      } catch (error) {
        errorMessage.value =
          "Impossible de supprimer la tâche. Veuillez vérifier le serveur.";
        console.error(error);
      }
    };

    const toggleComplete = async (todo: Todo) => {
      try {
        await axios.put(`http://localhost:5001/api/todos/${todo._id}`, {
          completed: todo.completed,
        });
      } catch (error) {
        errorMessage.value =
          "Impossible de mettre à jour la tâche. Veuillez vérifier le serveur.";
        console.error(error);
      }
    };

    const startEditing = (id: string) => {
      editingTodoId.value = id;
    };

    const updateTodoText = async (todo: Todo) => {
      if (todo.text.trim() === "") {
        errorMessage.value = "Le texte de la tâche ne peut pas être vide.";
        return;
      }
      try {
        await axios.put(`http://localhost:5001/api/todos/${todo._id}`, {
          text: todo.text,
        });
        editingTodoId.value = null;
      } catch (error) {
        errorMessage.value =
          "Impossible de mettre à jour la tâche. Veuillez vérifier le serveur.";
        console.error(error);
      }
    };

    onMounted(fetchTodos);

    return {
      newTodo,
      todos,
      addTodo,
      deleteTodo,
      toggleComplete,
      startEditing,
      updateTodoText,
      editingTodoId,
      errorMessage,
    };
  },
});
</script>

<style scoped>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>
