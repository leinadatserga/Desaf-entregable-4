import { Router } from 'express';
import { ProductManager } from '../controllers/productManager.js';
const productManager = new ProductManager ( "./src/models/products.json" );
const routerProd = Router ();

routerProd.get ( "/", async ( req, res ) => {
    const { limit } = req.query;
    const prods = await productManager.getProducts ();
    const products = prods.slice ( 0, limit );
    res.status ( 200 ).json ( products );
});
routerProd.get ( "/:pid", async ( req, res ) => {
    const { pid } = req.params;
    const prod = await productManager.getProductById ( parseInt ( pid ));
    if ( prod ) {
        res.status ( 200 ).json ( prod );
    } else {
        res.status ( 404 ).send ( "Error! Product not found" );
    }
});
routerProd.post ( "/", async ( req, res ) => {
    const confirm = await productManager.addProduct ( req.body );
    if ( confirm ) {
        res.status ( 200 ).send ( "Product added successfully" );
    } else {
        res.status ( 400 ).send ( "Error! product already exists" );
    }
});
routerProd.put ( "/:pid", async ( req, res ) => {
    const { pid } = req.params;
    const confirm = await productManager.updateProduct ( parseInt ( pid ), req.body );
    if ( confirm ) {
        res.status ( 200 ).send ( "Product updated successfully" );
    } else {
        res.status ( 404 ).send ( "Error! Product not found" );
    }
});
routerProd.delete ( "/:pid", async ( req, res ) => {
    const { pid } = req.params;
    const confirm = await productManager.deleteProduct ( parseInt ( pid ) );
    if ( confirm ) {
        res.status ( 200 ).send ( "Product successfully removed" );
    } else {
        res.status ( 404 ).send ( "Error! Product not found" );
    }
});

export default routerProd;