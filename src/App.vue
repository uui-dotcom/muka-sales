<template>
  <div class="app">
    <header>
      <h1>Учёт продаж муки и полуфабрикатов</h1>
      <p class="subtitle">КФХ Молевой Н.Н. — с. Могоенок</p>
    </header>

    <nav class="tabs">
      <button :class="{ active: tab === 'sale' }" @click="tab = 'sale'">Продажа</button>
      <button :class="{ active: tab === 'products' }" @click="tab = 'products'">Товары</button>
      <button :class="{ active: tab === 'clients' }" @click="tab = 'clients'">Клиенты</button>
      <button :class="{ active: tab === 'reports' }" @click="tab = 'reports'">Отчёты</button>
    </nav>

    <main>
      <SalesForm v-if="tab === 'sale'" />
      <ProductsList v-if="tab === 'products'" />
      <ClientsList v-if="tab === 'clients'" />
      <Reports v-if="tab === 'reports'" />
    </main>

    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import SalesForm from './components/SalesForm.vue'
import ProductsList from './components/ProductsList.vue'
import ClientsList from './components/ClientsList.vue'
import Reports from './components/Reports.vue'

const tab = ref('sale')
const notification = ref(null)

const showNotification = (text, type = 'success') => {
  notification.value = { text, type }
  setTimeout(() => { notification.value = null }, 3000)
}

provide('notify', showNotification)
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f0f4f0;
  color: #222;
}

.app { max-width: 1100px; margin: 0 auto; padding: 20px; }

header { text-align: center; margin-bottom: 24px; }
header h1 { font-size: 24px; color: #2e5a2e; }
.subtitle { color: #666; font-size: 14px; margin-top: 4px; }

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.tabs button:hover { background: #e8f0e8; }
.tabs button.active { background: #2e5a2e; color: #fff; }

main { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

.notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 20px;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.notification.success { background: #2e7d32; }
.notification.error { background: #c62828; }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

input, select, button { font-family: inherit; }

.form-group { margin-bottom: 14px; }
.form-group label { display: block; margin-bottom: 4px; font-size: 14px; color: #444; }
.form-group input, .form-group select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.btn {
  padding: 9px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}
.btn-primary { background: #2e5a2e; color: #fff; }
.btn-primary:hover { background: #244a24; }
.btn-danger { background: #c62828; color: #fff; }
.btn-danger:hover { background: #a02020; }
.btn-secondary { background: #e0e0e0; color: #333; }
.btn-secondary:hover { background: #d0d0d0; }

table { width: 100%; border-collapse: collapse; margin-top: 12px; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
th { background: #f5f8f5; font-weight: 600; color: #333; }
tr:hover { background: #fafcfa; }
</style>