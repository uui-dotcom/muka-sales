<template>
  <div>
    <h2>Отчёты по продажам</h2>

    <div class="filters">
      <div class="form-group">
        <label>С даты</label>
        <input type="date" v-model="dateFrom" />
      </div>
      <div class="form-group">
        <label>По дату</label>
        <input type="date" v-model="dateTo" />
      </div>
    </div>

    <div class="summary">
      <div class="card">
        <div class="card-label">Продаж</div>
        <div class="card-value">{{ data.count }}</div>
      </div>
      <div class="card">
        <div class="card-label">Выручка</div>
        <div class="card-value">{{ data.revenue }} ₽</div>
      </div>
      <div class="card">
        <div class="card-label">Себестоимость</div>
        <div class="card-value">{{ data.cost }} ₽</div>
      </div>
      <div class="card highlight">
        <div class="card-label">Прибыль</div>
        <div class="card-value">{{ data.profit }} ₽</div>
      </div>
    </div>

    <h3>Продажи по товарам</h3>
    <table>
      <thead>
        <tr>
          <th>Товар</th>
          <th>Количество</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(stat, name) in data.productStats" :key="name">
          <td>{{ name }}</td>
          <td>{{ stat.qty }}</td>
          <td>{{ stat.sum }} ₽</td>
        </tr>
      </tbody>
    </table>

    <h3>История продаж</h3>
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Клиент</th>
          <th>Товары</th>
          <th>Сумма</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sales.slice().reverse()" :key="s.id">
          <td>{{ s.date }}</td>
          <td>{{ getClientName(s.clientId) }}</td>
          <td>
            <span v-for="(item, i) in s.items" :key="i">
              {{ item.name }} × {{ item.qty }}<span v-if="i < s.items.length - 1">, </span>
            </span>
          </td>
          <td>{{ s.total }} ₽</td>
          <td><button class="btn btn-danger" @click="removeSale(s.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../composables/useStore'

const { sales, getClientName, removeSale, report } = useStore()

const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
const today = now.toISOString().slice(0, 10)

const dateFrom = ref(firstDay)
const dateTo = ref(today)

const data = computed(() => report(dateFrom.value, dateTo.value))
</script>

<style scoped>
.filters { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.filters .form-group { flex: 1; min-width: 160px; }

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.card {
  background: #f5f8f5;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.card.highlight { background: #e8f5e8; border: 2px solid #2e5a2e; }
.card-label { font-size: 13px; color: #666; margin-bottom: 6px; }
.card-value { font-size: 20px; font-weight: 700; color: #2e5a2e; }

h3 { margin: 24px 0 8px; font-size: 17px; color: #333; }
</style>