import mongoose from "mongoose";
import getUri from ".";

async function getDB(callBack: (disconnect: () => Promise<void>) => Promise<void>) {
    mongoose.set('strictQuery', true);
    await mongoose.connect(getUri());
    await callBack(async () => {
        await mongoose.disconnect();
    });
}
export { getDB };