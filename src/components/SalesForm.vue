<template>
  <div>
    <h2>Оформление продажи</h2>

    <div class="form-group">
      <label>Клиент</label>
      <select v-model="selectedClient">
        <option :value="null">— выберите клиента —</option>
        <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>Дата</label>
      <input type="date" v-model="date" />
    </div>

    <h3>Товары</h3>
    <table>
      <thead>
        <tr>
          <th>Товар</th>
          <th>Цена</th>
          <th>Остаток</th>
          <th>Количество</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td>
            <select v-model="item.productId">
              <option :value="null">— товар —</option>
              <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </td>
          <td>{{ getPrice(item.productId) }} ₽</td>
          <td>{{ getStock(item.productId) }}</td>
          <td><input type="number" min="1" v-model.number="item.qty" style="width: 80px;" /></td>
          <td><button class="btn btn-danger" @click="removeItem(index)">×</button></td>
        </tr>
      </tbody>
    </table>

    <button class="btn btn-secondary" @click="addItem" style="margin-top: 10px;">+ Добавить товар</button>

    <div class="total">
      <strong>Итого: {{ total }} ₽</strong>
    </div>

    <button class="btn btn-primary" @click="submit" :disabled="!selectedClient || items.length === 0">
      Оформить продажу
    </button>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useStore } from '../composables/useStore'

const { products, clients, addSale } = useStore()
const notify = inject('notify')

const selectedClient = ref(null)
const date = ref(new Date().toISOString().slice(0, 10))
const items = ref([{ productId: null, qty: 1 }])

const addItem = () => items.value.push({ productId: null, qty: 1 })
const removeItem = (i) => items.value.splice(i, 1)

const getPrice = (id) => {
  const p = products.value.find(p => p.id === id)
  return p ? p.price : 0
}

const getStock = (id) => {
  const p = products.value.find(p => p.id === id)
  return p ? p.stock : '—'
}

const total = computed(() => {
  return items.value.reduce((sum, item) => {
    const p = products.value.find(p => p.id === item.productId)
    return sum + (p ? p.price * (item.qty || 0) : 0)
  }, 0)
})

const submit = () => {
  const validItems = items.value.filter(i => i.productId && i.qty > 0)
  if (validItems.length === 0) {
    notify('Добавьте хотя бы один товар', 'error')
    return
  }

  const result = addSale({
    clientId: selectedClient.value,
    date: date.value,
    items: validItems
  })

  if (result.success) {
    notify(result.message, 'success')
    items.value = [{ productId: null, qty: 1 }]
    selectedClient.value = null
  } else {
    notify(result.message, 'error')
  }
}
</script>

<style scoped>
.total {
  margin: 20px 0;
  font-size: 18px;
  color: #2e5a2e;
}
</style>