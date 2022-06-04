const app = require('express')();
const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

function PrimeCheck(params) {
    const obj = {
        isPrime : true,
        worker: process.pid,
        Number : params,
        Time : new Date()
    }
    for (let i = 3; i < params; i++) {
        if (params % i == 0) 
            obj.isPrime = false;
    }
    let val = new Date();
    obj.Time = val.getTime() - obj.Time.getTime();
    return obj;
}

app.get('/', (req, res) => {
    console.log(`im .......... ${process.pid}`);
    res.send(PrimeCheck(req.query.number));
})

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    app.listen(3000, () => console.log('port 3000 is listening by worker ' + process.pid));
}