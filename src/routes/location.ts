import { Router } from 'express';
import locationController from '../controllers/location';
import middlewares from '../middlewares';
import { validate } from '../utils/validate';
import { createLocationSchema } from '../controllers/location/validate';

const LocationRouter = Router();
LocationRouter.get('', locationController.get);
LocationRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createLocationSchema), locationController.create);
LocationRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, locationController.findOneAndUpdate);

export default LocationRouter;