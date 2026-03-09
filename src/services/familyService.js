const { Family, PregnantMother, LactatingMother, Child, AdministrativeUnit } = require("../models");
const sequelize = require("../config/database");
const { AppError } = require("../middlewares/errorMiddleware");

const createFamilyService = async (familyData, user) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            block_id,
            registration_number,
            house_number,
            head_of_household_name,
            phone_number,
            is_vulnerable,
            is_safetynet_beneficiary,
            health_insurance_type,
            is_temporary_direct_support_beneficiary,
            latitude,
            longitude,
            guardian_name,
            guardian_gender,
            guardian_dob,
            guardian_phone_number,
            pregnant_mother,
            lactating_mother,
            children
        } = familyData;

        // 1. Verify Block Exists and Jurisdiction
        const block = await AdministrativeUnit.findOne({
            where: { id: block_id, level: "BLOCK" },
            transaction
        });

        if (!block) {
            throw new AppError("errors.block_not_found", 404);
        }

        // We must verify if this block ultimately belongs to the user's Health Center
        // Block -> Ketena -> Woreda -> Health Center
        const ketena = await AdministrativeUnit.findOne({ where: { id: block.parent_id, level: "KETENA" }, transaction });
        if (!ketena) throw new AppError("errors.block_not_found", 404);

        const woreda = await AdministrativeUnit.findOne({ where: { id: ketena.parent_id, level: "WOREDA", parent_id: user.unit.id }, transaction });
        if (!woreda) throw new AppError("errors.block_not_found", 404); // Not in their jurisdiction

        // 2. Check for Duplicate Registration Number
        const existingFamily = await Family.findOne({
            where: { registration_number },
            transaction
        });

        if (existingFamily) {
            throw new AppError("errors.registration_number_exists", 400);
        }

        // 3. Create the Family core record
        const newFamily = await Family.create({
            block_id,
            registration_number,
            house_number,
            head_of_household_name,
            phone_number,
            is_vulnerable,
            is_safetynet_beneficiary,
            health_insurance_type,
            is_temporary_direct_support_beneficiary,
            latitude,
            longitude,
            guardian_name,
            guardian_gender,
            guardian_dob,
            guardian_phone_number,
            created_by: user.user_id,
        }, { transaction });

        // 4. Create Pregnant Mother if provided
        if (pregnant_mother) {
            await PregnantMother.create({
                family_id: newFamily.id,
                name: pregnant_mother.name,
                dob: pregnant_mother.dob
            }, { transaction });
        }

        // 5. Create Lactating Mother if provided
        if (lactating_mother) {
            await LactatingMother.create({
                family_id: newFamily.id,
                name: lactating_mother.name,
                dob: lactating_mother.dob
            }, { transaction });
        }

        // 6. Create Children if provided
        if (children && children.length > 0) {
            const childrenData = children.map(child => ({
                family_id: newFamily.id,
                name: child.name,
                gender: child.gender,
                dob: child.dob,
                vulnerable_to_growth_restriction: child.vulnerable_to_growth_restriction || false
            }));

            await Child.bulkCreate(childrenData, { transaction });
        }

        await transaction.commit();

        return newFamily;
    } catch (error) {
        await transaction.rollback();
        if (error instanceof AppError) throw error;
        console.error("Family Creation Error:", error);
        throw new AppError("errors.create_family_error", 500);
    }
};

const updateFamilyService = async (familyId, familyData, user) => {
    const transaction = await sequelize.transaction();

    try {
        const family = await Family.findOne({ where: { id: familyId }, transaction });
        if (!family) {
            throw new AppError("errors.family_not_found", 404);
        }

        // Check Jurisdiction of the current block
        // (Ensure the Health Center admin still has rights to this family's original block)
        const block = await AdministrativeUnit.findOne({
            where: { id: family.block_id, level: "BLOCK" },
            transaction
        });
        if (!block) throw new AppError("errors.family_not_found", 404);

        const ketena = await AdministrativeUnit.findOne({ where: { id: block.parent_id, level: "KETENA" }, transaction });
        const woreda = await AdministrativeUnit.findOne({ where: { id: ketena.parent_id, level: "WOREDA", parent_id: user.unit.id }, transaction });

        if (!woreda) {
            throw new AppError("errors.family_not_found", 404); // Outside jurisdiction
        }

        // If they are attempting to move the family to a new block, verify the new block is also in jurisdiction
        if (familyData.block_id && familyData.block_id !== family.block_id) {
            const newBlock = await AdministrativeUnit.findOne({
                where: { id: familyData.block_id, level: "BLOCK" },
                transaction
            });
            if (!newBlock) throw new AppError("errors.block_not_found", 404);

            const newKetena = await AdministrativeUnit.findOne({ where: { id: newBlock.parent_id, level: "KETENA" }, transaction });
            const newWoreda = await AdministrativeUnit.findOne({ where: { id: newKetena.parent_id, level: "WOREDA", parent_id: user.unit.id }, transaction });
            if (!newWoreda) throw new AppError("errors.block_not_found", 404);
        }

        // Update core family record (excluding nested relations)
        const coreUpdateData = { ...familyData };
        delete coreUpdateData.pregnant_mother;
        delete coreUpdateData.lactating_mother;
        delete coreUpdateData.children;

        await family.update(coreUpdateData, { transaction });

        // Update Pregnant Mother dynamically 
        if (familyData.pregnant_mother !== undefined) {
            await PregnantMother.destroy({ where: { family_id: familyId }, transaction });
            if (familyData.pregnant_mother !== null) {
                await PregnantMother.create({
                    family_id: familyId,
                    name: familyData.pregnant_mother.name,
                    dob: familyData.pregnant_mother.dob
                }, { transaction });
            }
        }

        // Update Lactating Mother dynamically
        if (familyData.lactating_mother !== undefined) {
            await LactatingMother.destroy({ where: { family_id: familyId }, transaction });
            if (familyData.lactating_mother !== null) {
                await LactatingMother.create({
                    family_id: familyId,
                    name: familyData.lactating_mother.name,
                    dob: familyData.lactating_mother.dob
                }, { transaction });
            }
        }

        // Update Children dynamically
        if (familyData.children !== undefined) {
            await Child.destroy({ where: { family_id: familyId }, transaction });
            if (familyData.children !== null && familyData.children.length > 0) {
                const childrenData = familyData.children.map(child => ({
                    family_id: familyId,
                    name: child.name,
                    gender: child.gender,
                    dob: child.dob,
                    vulnerable_to_growth_restriction: child.vulnerable_to_growth_restriction || false
                }));
                await Child.bulkCreate(childrenData, { transaction });
            }
        }

        await transaction.commit();
        return family;
    } catch (error) {
        await transaction.rollback();
        if (error instanceof AppError) throw error;
        console.error("Family Update Error:", error);
        throw new AppError("errors.update_family_error", 500);
    }
};

module.exports = {
    createFamilyService,
    updateFamilyService,
};
