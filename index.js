const app = require('./app.js');

const PORT = 4001;

app.listen(PORT, "localhost", () => {
    console.log(`Server is running on port ${PORT}`);
})
 