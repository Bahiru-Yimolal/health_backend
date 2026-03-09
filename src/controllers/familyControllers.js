const { createFamilyService, updateFamilyService } = require("../services/familyService");

const createFamilyController = async (req, res, next) => {
    try {
        // req.body contains the unified family JSON block
        const newFamily = await createFamilyService(req.body, req.user);

        res.status(201).json({
            success: true,
            message: req.t("success.family_created"),
            data: newFamily,
        });
    } catch (error) {
        next(error);
    }
};

const updateFamilyController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFamily = await updateFamilyService(id, req.body, req.user);

        res.status(200).json({
            success: true,
            message: req.t("success.family_updated"),
            data: updatedFamily,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFamilyController,
    updateFamilyController,
};
