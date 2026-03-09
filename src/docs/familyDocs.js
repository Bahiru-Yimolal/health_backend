/**
 * @swagger
 * tags:
 *   name: Families
 *   description: Household and Dependent registration endpoints
 */

/**
 * @swagger
 * /api/families:
 *   post:
 *     summary: Register a new Family and all dependents
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - block_id
 *               - registration_number
 *               - head_of_household_name
 *               - health_insurance_type
 *             properties:
 *               block_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               registration_number:
 *                 type: string
 *                 example: "Aq/A11/B20/001"
 *               house_number:
 *                 type: string
 *                 example: "123"
 *               head_of_household_name:
 *                 type: string
 *                 example: "Abebe Kebede"
 *               phone_number:
 *                 type: string
 *                 example: "0911223344"
 *               is_vulnerable:
 *                 type: boolean
 *                 example: true
 *               is_safetynet_beneficiary:
 *                 type: boolean
 *                 example: false
 *               health_insurance_type:
 *                 type: string
 *                 enum: [FREE_OR_SPONSORED, PAYING, NOT_BENEFICIARY]
 *                 example: "FREE_OR_SPONSORED"
 *               is_temporary_direct_support_beneficiary:
 *                 type: boolean
 *                 example: false
 *               latitude:
 *                 type: number
 *                 example: 9.005401
 *               longitude:
 *                 type: number
 *                 example: 38.763611
 *               guardian_name:
 *                 type: string
 *                 example: "Almaz"
 *               guardian_gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: "FEMALE"
 *               guardian_dob:
 *                 type: string
 *                 format: date
 *                 example: "1980-05-12"
 *               guardian_phone_number:
 *                 type: string
 *                 example: "0922334455"
 *               pregnant_mother:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Aster Abebe"
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: "1995-10-21"
 *               lactating_mother:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Tigist Abebe"
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: "1998-02-14"
 *               children:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Biniyam Abebe"
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                       example: "MALE"
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: "2021-03-15"
 *                     vulnerable_to_growth_restriction:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Family created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Family created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or duplicate registration number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       404:
 *         description: Block not found or outside jurisdiction
 *       500:
 *         description: Internal server error creating family
 * 
 * /api/families/{id}:
 *   put:
 *     summary: Update an existing Family and its dependents
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The existing Family UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               block_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               registration_number:
 *                 type: string
 *                 example: "Aq/A11/B20/001"
 *               house_number:
 *                 type: string
 *                 example: "123"
 *               head_of_household_name:
 *                 type: string
 *                 example: "Abebe Kebede (Updated)"
 *               phone_number:
 *                 type: string
 *                 example: "0911223344"
 *               is_vulnerable:
 *                 type: boolean
 *                 example: true
 *               is_safetynet_beneficiary:
 *                 type: boolean
 *                 example: false
 *               health_insurance_type:
 *                 type: string
 *                 enum: [FREE_OR_SPONSORED, PAYING, NOT_BENEFICIARY]
 *                 example: "PAYING"
 *               is_temporary_direct_support_beneficiary:
 *                 type: boolean
 *                 example: false
 *               latitude:
 *                 type: number
 *                 example: 9.005401
 *               longitude:
 *                 type: number
 *                 example: 38.763611
 *               guardian_name:
 *                 type: string
 *                 example: "Almaz"
 *               guardian_gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               guardian_dob:
 *                 type: string
 *                 format: date
 *               guardian_phone_number:
 *                 type: string
 *               pregnant_mother:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   dob:
 *                     type: string
 *                     format: date
 *                 nullable: true
 *               lactating_mother:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   dob:
 *                     type: string
 *                     format: date
 *                 nullable: true
 *               children:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                     dob:
 *                       type: string
 *                       format: date
 *                     vulnerable_to_growth_restriction:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Family updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Family updated successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       404:
 *         description: Family or Block not found
 *       500:
 *         description: Internal server error updating
 */
