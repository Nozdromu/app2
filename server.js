
require('dotenv').config();
const express = require('express')
const { Client } = require('@googlemaps/google-maps-services-js')
const axios = require('axios')
const mysql = require('mysql');
const session = require('express-session')
const socketio = require('socket.io')
const http = require('http')
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
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
const sessionStore = new MySQLStore({}, connection);
sessionStore.onReady().then(() => {
    // MySQL session store ready for use.
    console.log('MySQLStore ready');
}).catch(error => {
    // Something went wrong.
    console.error(error);
});
const sessionMiddleware = session({
    secret: '12345678',
    saveUninitialized: true,
    resave: false,
    store: sessionStore,
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

io.engine.use(sessionMiddleware);

var addressList = {};
var userList = {};
var tripList = {};
connection.query('call get_tables()', (err, res, field) => {
    addressList = data_t(res[0]); 
    userList = data_t(res[2]);
    tripList = data_t(res[1]);
    Object.keys(tripList).forEach(((e)=>{
        tripList[e].origin=addressList[tripList[e].pickup_location]
        tripList[e].destination=addressList[tripList[e].dropoff_location]
    }))
    console.log('address table:'+addressList)
    console.log('trip table:'+userList)
    console.log('user table:'+tripList)
})
var data_t = (data) => {
    var return_data = {};
    data.forEach(element => {
        return_data[element.id] = element;
    });
    return return_data;
}
var getTripData=()=>{

}
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
    var _data = data
    var cost = _data.car === '1' ? 0.5 : 0.25;
    if (_data.pickup_dis > _data.pickup_dis_aviod) {
        _data.pickup_total = cost * _data.pickup_dis
    }
    _data.dropoff_total = 2 * _data.dropoff_dis
    _data.total = _data.pickup_total + _data.dropoff_total;
    return _data
}

var checkaddress = (destination, origin, callback) => {
    connection.query('call findaddress(?,?)', [origin.address, destination.address], (err, res, field) => {
        var address_id = {
            origin: {},
            destination: {},
            process: 0
        }
        if (res[0].length > 0 && res[1].length > 0) {
            address_id.origin = res[0][0].id;
            address_id.destination = res[1][0].id
            address_id.process = 1
            callback(address_id)
        } else {
            if (res[1].length === 0) {
                connection.query('call new_address(?,?,?,?,?)', [destination.address, destination.lat, destination.lng, 0, 0], (f_err, f_res, field) => {
                    if (f_err) {
                        console.log('saveaddress failed: ' + f_err)
                    } else {
                        console.log('address saved')
                        address_id.destination = f_res[0][0]
                        address_id.process = 2
                    }
                    if (res[1].length === 0) {
                        connection.query('call new_address(?,?,?,?,?)', [origin.address, origin.lat, origin.lng, origin.pickup_dis, origin.dropoff_dis], (t_err, t_res, field) => {
                            if (t_err) {
                                console.log('saveaddress failed: ' + t_err)
                            } else {
                                console.log('address saved')
                                address_id.origin = t_res[0][0]
                                address_id.process = 3
                                callback(address_id)
                            }
                        })
                    }
                })

            } else {
                address_id.destination = res[1][0].id;
                if (res[0].length === 0) {
                    connection.query('call new_address(?,?,?,?,?)', [origin.address, origin.lat, origin.lng, origin.pickup_dis, origin.dropoff_dis], (t_err, t_res, field) => {
                        if (t_err) {
                            console.log('saveaddress failed: ' + t_err)
                        } else {
                            console.log('address saved')
                            address_id.origin = t_res[0][0]
                            address_id.process = 4
                            callback(address_id)
                        }
                    })
                }
            }
        }
    })
}
app.get('/', (req, res) => {
    res.sendFile('index.html')
})
app.get('/newres', (req, res) => {

})
app.get('/price', (req, res) => {
    var data = req.query;
    console.log(data);
    map.directions({ params: { key: process.env.google_map_api_key, destination: data.end, origin: '6835 SE Cougar Mountain Way, Bellevue, WA 98006, USA', waypoints: [data.start] } }).then((mapres) => {
        console.log(mapres)
        var pricedata = {
            pickup_date: data.date,
            pickup_time: data.time,
            car: data.car,
            address1: {
                address: mapres.data.routes[0].legs[0].end_address,
                lat: mapres.data.routes[0].legs[0].end_location.lat,
                lng: mapres.data.routes[0].legs[0].end_location.lng,
                pickup_dis: Math.round(mapres.data.routes[0].legs[0].distance.value / 1609.344),
                dropoff_dis: Math.round(mapres.data.routes[0].legs[1].distance.value / 1609.344)
            },
            address2: {
                address: mapres.data.routes[0].legs[1].end_address,
                lat: mapres.data.routes[0].legs[1].end_location.lat,
                lng: mapres.data.routes[0].legs[1].end_location.lng,
                pickup_dis: Math.round(mapres.data.routes[0].legs[0].distance.value / 1609.344),
                dropoff_dis: Math.round(mapres.data.routes[0].legs[1].distance.value / 1609.344)
            },
            lat: mapres.data.routes[0].legs[0].end_location.lat,
            lng: mapres.data.routes[0].legs[0].end_location.lng,
            pickup_dis: Math.round(mapres.data.routes[0].legs[0].distance.value / 1609.344),
            pickup_price: 0.5,
            pickup_total: 0,
            pickup_dis_aviod: 8,
            dropoff_dis: Math.round(mapres.data.routes[0].legs[1].distance.value / 1609.344),
            dropoff_price: 2,
            dropoff_total: 0,
            total: 0,
            esttime: mapres.data.routes[0].legs[1].duration.text
        }

        pricedata = pricing(pricedata)
        req.session.bookinfo = pricedata;
        res.send(pricedata)

    }).catch((err) => {
        console.log(err)
        res.send(err)
    })


})

app.get('/book', (req, res) => {
    var bookinfo = req.session.bookinfo;
    checkaddress(bookinfo.address2, bookinfo.address1, (data) => {
        connection.query('call new_trip(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
            0,
            bookinfo.pickup_date,
            bookinfo.pickup_time,
            data.origin,
            bookinfo.pickup_dis,
            data.destination,
            bookinfo.dropoff_dis,
            bookinfo.pickup_total,
            bookinfo.dropoff_total,
            bookinfo.total,
            "",
            "",
            bookinfo.esttime,
            bookinfo.car,
            bookinfo.pickup_price,
            bookinfo.dropoff_price
        ], (err, mysql_res, fil) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(mysql_res);
                res.send(mysql_res);
            }
        })

    })

})
server.listen(port, () => {
    console.log('start listening on ' + port)
})

