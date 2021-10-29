const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const orderRoutes = require('./routes/orders')
const app = express();
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const User = require('./models/user');

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('6173a6552bd0797f06048ad9');
        req.user = user;
        next();
    } catch(e) {
        console.log(e);
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/' , homeRoutes);
app.use('/add' , addRoutes);
app.use('/courses' , coursesRoutes);
app.use('/card' , cardRoutes);
app.use('/orders', orderRoutes)

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        const url = `mongodb+srv://tolik:ggamer@cluster0.ncpjg.mongodb.net/shop`
        await mongoose.connect(url, {
            useNewUrlParser: true,
        });

        const candidate = await User.findOne()
        if(!candidate) {
            const user = new User({
                email: 'tolik@mail.ru',
                name: 'Tolik',
                cart: { items: []}
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch(e) {
        console.log(e);
    }
}

start();