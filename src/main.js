import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import routerProd from './routes/products.routes.js';
import routerCart from './routes/carts.routes.js';
import { __dirname } from "./path.js";
import path from 'path';
import { ProductManager } from '../src/controllers/productManager.js';
const productManager = new ProductManager ( "./src/models/products.json" );

const PORT = 8080;
const app = express ();
const server = app.listen ( PORT, () => {
    console.log ( `Server port: ${ PORT }` );
});

const io = new Server ( server );
app.use ( express.urlencoded ({ extended: true }));
app.use ( express.json ());
app.engine ( "handlebars", engine ());
app.set ( "view engine", "handlebars" );
app.set ( "views", path.resolve ( __dirname, "./views" ));
app.use ( "/static", express.static ( path.join ( __dirname, "/public" )));
app.use ( "/api/carts", routerCart);
app.use ( "/api/products", routerProd);
let prods = await productManager.getProducts();
io.on ( "connection", ( socket ) => {
    console.log( "Socket.io connection" );
    socket.on ( "newProduct", ( productData ) => {
        productManager.addProduct(productData);
        prods = productManager.getProducts();
    });
    socket.emit ( "reload", true );
})

app.get ( "/static/realtimeproducts", ( req, res ) => {
    res.render ( "realTimeProducts", {
        title: "RealTimeProducts",
        nombre: "Ingreso de nuevo Producto",
        productsList: prods,
        pathCss: "realTimeProducts",
        pathJs: "realTimeProducts"
    })
})
app.get ( "/static", ( req, res ) => {
    res.render ( "home", {
        title: "Home",
        nombre: "Lista de Productos",
        productsList: prods,
        pathCss: "style",
        pathJs: "script"
    })
})
