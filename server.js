
require('dotenv').config();
const express = require('express')
const { Client } = require('@googlemaps/google-maps-services-js')
const axios = require('axios')
const mysql = require('mysql');
const session = require('express-session')
const socketio = require('socket.io')
const http = require('http')
const MySQLStore = require('express-mysql-session')(session);
const path=require('path')
console.log(process.env.mysql_user)

var connection = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
})
const sessionMiddleware = session({
    secret: '12345678',
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
    }
})


const app = express()
app.use(express.static(path.join(__dirname, 'build')));
const server = http.createServer(app)
const port = 3001
app.set('trust proxy', 1) // trust first proxy
app.use(sessionMiddleware)
var io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})



const map = new Client({});
console.log(process.env.mysql_user)
const sessionStore = new MySQLStore({}, connection);
sessionStore.onReady().then(() => {
    // MySQL session store ready for use.
    console.log('MySQLStore ready');
}).catch(error => {
    // Something went wrong.
    console.error(error);
});
io.engine.use(sessionMiddleware);

var addressList = [];
connection.query('SELECT * FROM test.address_book;', (err, res, field) => {
    addressList = res;
    console.log(addressList)
})

app.get('/gencode', (req, res) => {
    console.log(req.query);
    console.log(process.env.uber_client_secret)
    map.geolocate({ params: { key: process.env.google_map_api_key, address: req.query.start } }).then((mapres) => {
        console.log(mapres)
        res.send(mapres)
    }).catch((error) => {
        console.log(error)
        res.send(error)
    })
})
app.get('/uber_token', (req, res) => {
    var token_form = new FormData();
    token_form.append('client_secret', process.env.uber_client_secret)
    token_form.append('client_id', process.env.uber_Application_ID)
    token_form.append('grant_type', process.env.uber_grant_type)
    token_form.append('scope', 'guests.trips')

    // axios.post(process.env.uber_get_token_url,token_form).then((res)=>{

    // }).catch((error)=>{
    //     console.log(error)
    // })
    console.log(token_form)
})
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('coming', (msg) => {
        console.log(msg)
    })
})


var pricing = (data) => {
    var _data=data
    var cost=_data.car==='1'?0.5:0.25;
    if (_data.pickup_dis > _data.pickup_dis_aviod) {
        _data.pickup_total = cost*_data.pickup_dis
    }
    _data.dropoff_total= 2*_data.dropoff_dis
    _data.total=_data.pickup_total+_data.dropoff_total;
    return _data
}

var get_directions = (destination, origin, callback) => {
    connection.query('call findaddress(?,?)', [origin, destination], (err, res, field) => {

        var pricedata = {
            pickup_dis: 0,
            pickup_price: 0.5,
            pickup_dis_aviod: 10,
            dropoff_dis: 0,
            dropoff_price: 2,
            time: 0
        }
        var newaddressdata={
            address:'',
            lat:'',
            lng:'',
            pick_dis:0,
            drop_dis:0
        }
        // if (res[0].length > 0 && res[1].length > 0) {
        //     pricedata.pickup_dis = res[0].pick_dis;
        //     pricedata.dropoff_dis = res[1].drop_dis;
        // }
        // else {
        //     map.directions({ params: { key: process.env.google_map_api_key, destination: destination, origin: '6835 SE Cougar Mountain Way, Bellevue, WA 98006, USA', waypoints: [origin] } }).then((mapres) => {
        //         // newaddressdata.address=mapres.data.results.routes[0].legs
        //         // newaddressdata.lat=mapres.data.results.routes[0].legs
        //         // newaddressdata.lng=mapres.data.results.routes[0].legs
        //         // newaddressdata.pick_dis=mapres.data.results.routes[0].legs
        //         // newaddressdata.drop_dis=mapres.data.results.routes[0].legs
        //         callback(mapres.data.results)
        //     }).catch((err) => {
        //         callback(err)
        //     })
        // }
    })

}
app.get('/',(req,res)=>{
    res.sendFile('index.html')
})
app.get('/price', (req, res) => {
    var data = req.query;
    console.log(data);
    //res.send(data)
    // map.geocode({params:{ key: process.env.google_map_api_key, address: data.start }}).then((mapres) => {
    //     console.log(mapres)
    //     res.send(mapres.data.results[0])
    // }).catch((err) => {
    //     console.log(err)
    //     res.send(err)
    // })
    map.directions({ params: { key: process.env.google_map_api_key, destination: data.end, origin: '6835 SE Cougar Mountain Way, Bellevue, WA 98006, USA', waypoints: [data.start] } }).then((mapres) => {
        console.log(mapres)
        var pricedata = {
            car:data.car,
            address:mapres.data.routes[0].legs[0].end_address,
            lat:mapres.data.routes[0].legs[0].end_location.lat,
            lng:mapres.data.routes[0].legs[0].end_location.lng,
            pickup_dis: Math.round(mapres.data.routes[0].legs[0].distance.value/1609.344),
            pickup_price: 0.5,
            pickup_total:0,
            pickup_dis_aviod: 8,
            dropoff_dis: Math.round(mapres.data.routes[0].legs[1].distance.value/1609.344),
            dropoff_price: 2,
            dropoff_total:0,
            total:0,
            time: mapres.data.routes[0].legs[1].duration.text
        }

        pricedata=pricing(pricedata)
        res.send(pricedata)

    }).catch((err) => {
        console.log(err)
        res.send(err)
    })


})
server.listen(port, () => {
    console.log('start listening on ' + port)
})

