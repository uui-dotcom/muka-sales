<template>
  <div>
    <h2>Клиенты</h2>

    <div class="add-form">
      <input v-model="newClient.name" placeholder="Название / ФИО" />
      <input v-model="newClient.phone" placeholder="Телефон" />
      <input v-model="newClient.address" placeholder="Адрес" />
      <button class="btn btn-primary" @click="add">Добавить</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Телефон</th>
          <th>Адрес</th>
          <th>Сумма покупок</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in clients" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.phone }}</td>
          <td>{{ c.address }}</td>
          <td>{{ clientTotal(c.id) }} ₽</td>
          <td><button class="btn btn-danger" @click="removeClient(c.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useStore } from '../composables/useStore'

const { clients, sales, addClient, removeClient } = useStore()
const notify = inject('notify')

const newClient = ref({ name: '', phone: '', address: '' })

const add = () => {
  if (!newClient.value.name) {
    notify('Введите название клиента', 'error')
    return
  }
  addClient({ ...newClient.value })
  newClient.value = { name: '', phone: '', address: '' }
  notify('Клиент добавлен', 'success')
}

const clientTotal = (id) => {
  return sales.value
    .filter(s => s.clientId === id)
    .reduce((sum, s) => sum + s.total, 0)
}
</script>

<style scoped>
.add-form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.add-form input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  min-width: 120px;
}
</style>