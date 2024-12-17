const express = require('express');
const app = express();
app.use(express.json());

const { 
    client, 
    createTables, 
    createCustomer, 
    createRestaurant,
    fetchCustomers, 
    fetchRestaurants,
    fetchReservations,
    createReservations,
    destroyReservations
} = require('./db');



const init = async() => {
    console.log('connecting to db');
    await client.connect();
    console.log('connected to db');
    await createTables();
    console.log('created tables');
    const [larry, curly, moe, Bobs, Joellas, BigBoys, Bernies] = await Promise.all([
        createCustomer({ name: 'larry'}),
        createCustomer({ name: 'curly'}),
        createCustomer({ name: 'moe'}),
        createRestaurant({ name: 'Bobs'}),
        createRestaurant({ name: 'Joellas'}),
        createRestaurant({ name: 'BigBoys'}),
        createRestaurant({ name: 'Bernies'})
    ]);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
const [reservation, reservation2] = await Promise.all([
    createReservations({
        customer_id: larry.id,
        restaurant_id: Joellas.id,
        date: '12/31/2024',
        party_count: 4,
    }),
    createReservations({
        customer_id: curly.id,
        restaurant_id: Bernies.id,
        date: '01/01/2025',
        party_count: 3
    }),
]);
console.log('reading reservations', await reservation, await reservation2);
console.log(await fetchReservations());
await destroyReservations({ id: reservation2.id, customer_id: reservation2.customer_id});
console.log(await fetchReservations());
};




init();