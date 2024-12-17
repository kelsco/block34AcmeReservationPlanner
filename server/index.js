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


app.get('/api/customers', async(req, res, next) => {
    try{
        res.send(await fetchCustomers());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/restaurants', async(req, res, next) => {
    try{
        res.send(await fetchRestaurants());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/reservations', async(req, res, next) => {
    try{
        res.send(await fetchReservations());
    } catch(ex) {
        next(ex);
    }
});

app.post('/api/customers/:name/reservations', async(req, res, next) => {
    try{
        res.status(201).send(await createReservations({name: req.params.name, restaurant_name: req.body.restaurant_name, date: req.body.date, party_count: req.body.party_count}))
    } catch(ex) {
        next(ex);
    }
})

app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next) => {
    try{
        await destroyReservations({customer_id: req.params.customer_id, id:req.params.id});
        res.sendStatus(204);
    } catch(ex) {
        next(ex);
    }
});




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
    console.log(larry);
    console.log(Joellas);

const [reservation, reservation2] = await Promise.all([
    createReservations({
        name: larry.name,
        restaurant_name: Joellas.name,
        date: '12/31/2024',
        party_count: 4,
    }),
    createReservations({
        name: curly.name,
        restaurant_name: Bernies.name,
        date: '01/01/2025',
        party_count: 3
    }),
]);


console.log('reading reservations', await reservation, await reservation2);
console.log(await fetchReservations())
await destroyReservations({ id: reservation.id, customer_id: reservation.customer_id});
console.log(await fetchReservations());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
    // console.log(`curl localhost:${port/api/customers}`);
    // console.log(`curl localhost:${port/api/restaurants}`);
    // console.log(`curl localhost:${port/api/reservations}`);
    // console.log(`curl -X DELETE localhost:${port}/api/customers/${moe.id}/reservations/${reservation2.id}`);
});

}

init();

