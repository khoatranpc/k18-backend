import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import RecruitmentModel from "../../models/recruiment";
import RoundCVModel from "../../models/recruiment/round/cv";

const recruitmentController = {
    getList: async (req: Request, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage } = req.query;
            const totalRecord = await RecruitmentModel.count({});
            const listData = await RecruitmentModel.find({}, { ...fields && getProjection(...fields as Array<string>) })
                .sort({
                    createdAt: -1
                })
                .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                .populate('courseApply', { ...fields && getProjection(...fields as Array<string>) });
            const dataSend = {
                listData,
                totalPage: Math.ceil(totalRecord / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }
            resClientData(res, 200, dataSend);
        } catch (error) {
            resClientData(res, 500, null);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const findExistedEmail = await RecruitmentModel.findOne({
                email: data.email
            });
            if (findExistedEmail) throw new Error('Email đã tồn tại');
            const createCandidate = await RecruitmentModel.create({
                ...data
            });
            await RoundCVModel.create({
                candidateId: createCandidate._id
            });
            resClientData(res, 201, createCandidate);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    },
    getOneById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fields } = req.query;
            const getCrrCandidate = await RecruitmentModel.findById(id)
                .populate('courseApply', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(res, 200, getCrrCandidate);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    }
}
export default recruitmentController;