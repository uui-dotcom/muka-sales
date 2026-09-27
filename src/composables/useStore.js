import { ref, watch } from 'vue'

const products = ref(JSON.parse(localStorage.getItem('products')) || [
  { id: 1, name: 'Мука пшеничная высший сорт', price: 45, cost: 30, stock: 500 },
  { id: 2, name: 'Мука пшеничная первый сорт', price: 38, cost: 25, stock: 400 },
  { id: 3, name: 'Мука ржаная', price: 42, cost: 28, stock: 300 },
  { id: 4, name: 'Пельмени домашние', price: 350, cost: 250, stock: 100 },
  { id: 5, name: 'Котлеты свино-говяжьи', price: 280, cost: 200, stock: 150 },
  { id: 6, name: 'Тефтели', price: 260, cost: 180, stock: 120 }
])

const clients = ref(JSON.parse(localStorage.getItem('clients')) || [
  { id: 1, name: 'ИП Иванов А.А.', phone: '+7 902 111-22-33', address: 'с. Могоенок, ул. Ленина, 5' },
  { id: 2, name: 'Магазин "Продукты"', phone: '+7 902 444-55-66', address: 'с. Кутулик, ул. Советская, 10' }
])

const sales = ref(JSON.parse(localStorage.getItem('sales')) || [])

watch(products, (val) => localStorage.setItem('products', JSON.stringify(val)), { deep: true })
watch(clients, (val) => localStorage.setItem('clients', JSON.stringify(val)), { deep: true })
watch(sales, (val) => localStorage.setItem('sales', JSON.stringify(val)), { deep: true })

export function useStore() {
  const addProduct = (product) => {
    product.id = Date.now()
    products.value.push(product)
  }

  const removeProduct = (id) => {
    products.value = products.value.filter(p => p.id !== id)
  }

  const addClient = (client) => {
    client.id = Date.now()
    clients.value.push(client)
  }

  const removeClient = (id) => {
    clients.value = clients.value.filter(c => c.id !== id)
  }

  const addSale = (sale) => {
    let total = 0
    const itemsDetailed = []

    for (const item of sale.items) {
      const product = products.value.find(p => p.id === item.productId)
      if (!product) return { success: false, message: 'Товар не найден' }
      if (product.stock < item.qty) {
        return { success: false, message: `Недостаточно "${product.name}" на складе. Остаток: ${product.stock}` }
      }
      total += product.price * item.qty
      itemsDetailed.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: item.qty
      })
    }

    for (const item of sale.items) {
      const product = products.value.find(p => p.id === item.productId)
      product.stock -= item.qty
    }

    const newSale = {
      id: Date.now(),
      clientId: sale.clientId,
      date: sale.date || new Date().toISOString().slice(0, 10),
      items: itemsDetailed,
      total
    }
    sales.value.push(newSale)
    return { success: true, message: 'Продажа оформлена', sale: newSale }
  }

  const removeSale = (id) => {
    const sale = sales.value.find(s => s.id === id)
    if (!sale) return
    for (const item of sale.items) {
      const product = products.value.find(p => p.id === item.productId)
      if (product) product.stock += item.qty
    }
    sales.value = sales.value.filter(s => s.id !== id)
  }

  const getClientName = (id) => {
    const c = clients.value.find(c => c.id === id)
    return c ? c.name : 'Неизвестный клиент'
  }

  const report = (dateFrom, dateTo) => {
    const filtered = sales.value.filter(s => s.date >= dateFrom && s.date <= dateTo)
    let revenue = 0
    let cost = 0
    const productStats = {}

    for (const sale of filtered) {
      revenue += sale.total
      for (const item of sale.items) {
        const product = products.value.find(p => p.id === item.productId)
        if (product) cost += product.cost * item.qty
        if (!productStats[item.name]) productStats[item.name] = { qty: 0, sum: 0 }
        productStats[item.name].qty += item.qty
        productStats[item.name].sum += item.price * item.qty
      }
    }

    return {
      count: filtered.length,
      revenue,
      cost,
      profit: revenue - cost,
      productStats
    }
  }

  return {
    products,
    clients,
    sales,
    addProduct,
    removeProduct,
    addClient,
    removeClient,
    addSale,
    removeSale,
    getClientName,
    report
  }
}