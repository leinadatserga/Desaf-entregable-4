const socket = io ();

const formProduct = document.getElementById ( "productForm" );
formProduct.addEventListener ( "submit", ( e ) => {
    e.preventDefault ();
    const formData = new FormData ( e.target );
    const productData = Object.fromEntries ( formData );
    productData.price = parseInt ( productData.price );
    productData.status = true;
    productData.stock = parseInt ( productData.stock );
    socket.emit ( "newProduct", productData );
    e.target.reset ();
    socket.on ( "reload", ( confirm ) => {
        if ( confirm ) {
            window.location.reload ( true );
        } else {
            console.log( "Product error" );
        }
    })
});
