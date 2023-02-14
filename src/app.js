import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.static(__dirname+'/public'));
app.use('/api/products/',productRouter);
app.use('/api/carts/',cartRouter);

app.listen(8080, () => {console.log('Servidor escuchando en localhost:8080...')})
