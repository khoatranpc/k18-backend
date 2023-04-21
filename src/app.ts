import express, { json, urlencoded } from 'express';
import RootRouter from './routes';
import cors from 'cors';

function App(port: number) {
    const app = express();

    app.use(cors({
        origin: [process.env.CLIENT_DOMAIN as string, process.env.CLIENT_DOMAIN_HOST as string]
    }))
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.get('', (req, res) => {
        res.status(200).send({
            message: 'Kết nối thành công!'
        })
    })
    app.use('/api/v1', RootRouter)

    app.listen(port, () => {
        console.log(`The application is listening on port ${port}!`);
    })
}
export default App
