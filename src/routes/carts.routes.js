import { Router } from 'express';
import { CartsManager } from '../controllers/cartsManager.js';
const cartsManager = new CartsManager ( "./src/models/carts.json" );
const routerCart = Router ();


routerCart.get ( "/", async ( req, res ) => {
    const { limit } = req.query;
    const prods = await cartsManager.getCarts ();
    const products = prods.slice ( 0, limit );
    res.status ( 200 ).json ( products );
});
routerCart.get ( "/:cid", async ( req, res ) => {
    const { cid } = req.params;
    const cart = await cartsManager.getCartById ( parseInt ( cid ));
    if ( cart ) {
        res.status ( 200 ).json ( cart );
    } else {
        res.status ( 404 ).send ( "Error! Cart don't exist." );
    }
});
routerCart.post ( "/", async ( req, res ) => {
    const confirm = await cartsManager.addCart ( req.body );
    if ( confirm ) {
        res.status ( 200 ).send ( "Cart added successfully." );
    } else {
        res.status ( 400 ).send ( "Error! Can't add more carts." );
    }
});
routerCart.post ( "/:cid/product/:pid", async ( req, res ) => {
    const { cid, pid } = req.params;
    const { product } = req.body;
    const confirm = await cartsManager.addProd ( cid, pid, product );
    if ( confirm ) {
        res.status ( 200 ).send ( "Product Id: " + pid + ", in cart nbr.: " + cid + " added successfully." );
    } else {
        res.status ( 400 ).send ( "Error! Cart don't exist." );
    }
});
routerCart.delete ( "/:cid", async ( req, res ) => {
    const { cid } = req.params;
    const confirm = await cartsManager.deleteCart ( parseInt ( cid ) );
    if ( confirm ) {
        res.status ( 200 ).send ( "Cart nbr.: " + cid + " successfully removed." );
    } else {
        res.status ( 404 ).send ( "Error! Cart not found." );
    }
});

export default routerCart;