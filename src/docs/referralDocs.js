/**
 * @swagger
 * tags:
 *   name: Referrals
 *   description: Health referral management between PC workers and facilities
 */

/**
 * @swagger
 * /referrals/incoming:
 *   get:
 *     summary: Get incoming referrals for the facility (Health Center)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, COMPLETED, REJECTED, all]
 *         description: Filter by referral status. Defaults to 'PENDING'. Use 'all' for all statuses.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of incoming referrals
 *       403:
 *         description: Forbidden (Role restricted)
 *
 * /referrals/{id}/feedback:
 *   patch:
 *     summary: Provide clinical feedback or acknowledge a referral
 *     description: |
 *       Allows facility staff to move a referral through its lifecycle:
 *       - **ACCEPTED**: Mark as received/acknowledged.
 *       - **COMPLETED**: Mark as finished after clinical service.
 *       - **REJECTED**: Mark if inappropriate or cannot be served.
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Referral ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - service_given
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, COMPLETED, REJECTED]
 *               service_given:
 *                 type: string
 *               recommendation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       404:
 *         description: Referral not found
 *
 * /referrals/sent:
 *   get:
 *     summary: Get referrals sent by the authenticated PC Worker (Paginated)
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, COMPLETED, REJECTED, all]
 *         description: Filter by referral status. Defaults to 'all'.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of sent referrals
 *
 * /referrals/stats:
 *   get:
 *     summary: Get referral statistics (counts by status) for the facility
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Object containing counts for PENDING, ACCEPTED, COMPLETED, and REJECTED
 *
 * /referrals/{id}:
 *   get:
 *     summary: Get details of a specific referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Referral details retrieved
 *       404:
 *         description: Referral not found
 */
