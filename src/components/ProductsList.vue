<template>
  <div>
    <h2>Товары на складе</h2>

    <div class="add-form">
      <input v-model="newProduct.name" placeholder="Название" />
      <input v-model.number="newProduct.price" type="number" placeholder="Цена" />
      <input v-model.number="newProduct.cost" type="number" placeholder="Себестоимость" />
      <input v-model.number="newProduct.stock" type="number" placeholder="Остаток" />
      <button class="btn btn-primary" @click="add">Добавить</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Цена</th>
          <th>Себестоимость</th>
          <th>Остаток</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.price }} ₽</td>
          <td>{{ p.cost }} ₽</td>
          <td :class="{ low: p.stock < 50 }">{{ p.stock }}</td>
          <td><button class="btn btn-danger" @click="removeProduct(p.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useStore } from '../composables/useStore'

const { products, addProduct, removeProduct } = useStore()
const notify = inject('notify')

const newProduct = ref({ name: '', price: 0, cost: 0, stock: 0 })

const add = () => {
  if (!newProduct.value.name) {
    notify('Введите название товара', 'error')
    return
  }
  addProduct({ ...newProduct.value })
  newProduct.value = { name: '', price: 0, cost: 0, stock: 0 }
  notify('Товар добавлен', 'success')
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
  min-width: 100px;
}
.low { color: #c62828; font-weight: 600; }
</style>