import axios from 'axios'
import instance from './instance'

const API_URL = 'http://localhost:9010'

const register = async payload => {
  try {
    const response = await axios.post(API_URL + '/pms/users/register', payload)

    return response
  } catch (error) {
    console.error(error)
    
    return error
  }
}
async function login(payload) {
  try {
    const response = await axios.post(API_URL + '/pms/users/login', payload)
    if (response.data.data.token) {
      localStorage.setItem('token', JSON.stringify(response.data.data.token))
    }

    return response.data
  } catch (error) {
    console.error(error)
  }
}

async function getOrders(){
  try {
    const response = await instance.get('pms/orders')

    return response

  } catch (error) {
    console.error(error)
  }
}
async function getCustomers(){
  try {
    const response = await instance.get('pms/customers/')

    return response

  } catch (error) {
    console.error(error)
  }
}
async function getInventory(){
  try {
    const response = await instance.get('pms/products')

    return response

  } catch (error) {
    console.error(error)
  }
}
async function getNotifications(){
  try {
    const response = await instance.get('pms/products/notifications')

    return response

  } catch (error) {
    console.error(error)
  }
}
async function addCustomers(payload){
    const response = await instance.post('pms/customers/' , payload)
    
    return response

 
}
async function addProduct(payload){
  const response = await instance.post('pms/products/' , payload)
  
  return response


}
async function updateProduct(payload){
  const response = await instance.put('pms/products/' , payload)
  
  return response


}

async function searchCustomers(payload){
  const response = await instance.get(`pms/customers/find?email=${payload}`)

  return response

}
async function searchProduct(payload){
  const response = await instance.get(`pms/products/search?product_sku=${payload}`)

  return response

}
async function getOrderByID(payload){
  const response = await instance.get(`pms/orders/customers?customer_id=${payload}`)

  return response

}
async function placeOrder(payload){
  const response = await instance.post('pms/orders' ,payload)

  return response

}

const logout = () => {
  localStorage.removeItem('token')
}

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'))
}

export default {
  register,
  login,
  logout,
  getOrders,
  getCurrentUser,
  getCustomers,
  addCustomers,
  searchCustomers,
  getNotifications,
  searchProduct,
  getInventory,
  addProduct,
  updateProduct,
  placeOrder,
  getOrderByID,
}
